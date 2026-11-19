# Security Specification — VEERA CCTV Firestore Rules

## 1. Data Invariants
1. Public catalog collections (`services`, `products`, `brands`, `projects`, `testimonials`, `gallery`, `siteSettings`) contain zero PII and can be read by visitors, but ONLY verified administrators (`isAdmin()`) may create, update, or delete records.
2. User profiles (`/users/{userId}`) contain PII (`email`, `phone`) and may ONLY be read or updated by the owning verified user (`request.auth.uid == userId && email_verified == true`) or an administrator.
3. Users CANNOT self-assign `role: "admin"` during account registration or profile updates (`role` must remain `"customer"` unless updated by an existing admin).
4. Quote inquiries (`/inquiries/{inquiryId}`) contain PII and require `ownerId == request.auth.uid` on creation with `status: "New"`, `createdAt == request.time`, and `updatedAt == request.time`. Only the owning user or an admin can read an inquiry, and only an admin can change `status` or delete inquiries.
5. Every document ID path variable is validated with `isValidId()` (`^[a-zA-Z0-9_\-]+$`, max 128 chars) on single-document operations (`get`, `create`, `update`, `delete`).
6. Every string field enforces strict `.size()` bounds and `keys().hasAll(...) && keys().hasOnly(...)` prevents shadow/ghost field injection.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Product Create**: `{ id: "p1", name: "Cam", ..., isVerified: true }` -> `PERMISSION_DENIED` (rejected by `keys().hasOnly(...)`).
2. **Self-Assigned Admin Role on User Registration**: `/users/uid1` `{ uid: "uid1", role: "admin", ... }` -> `PERMISSION_DENIED` (rejected by `role == 'customer'`).
3. **Privilege Escalation via User Update**: `/users/uid1` update `{ role: "admin" }` by non-admin -> `PERMISSION_DENIED` (rejected by `affectedKeys().hasOnly(['displayName', 'phone', 'updatedAt'])`).
4. **Email Spoofing (Unverified Email Token)**: `request.auth.token.email == 'kumawatshankarlal538@gmail.com'` with `email_verified: false` -> `PERMISSION_DENIED` (rejected by `email_verified == true`).
5. **PII Blanket Read on `/users`**: Non-admin authenticated user attempts `get(/users/otherUid)` or `list(/users)` -> `PERMISSION_DENIED`.
6. **Inquiry Identity Spoofing**: Authenticated user creates inquiry with `ownerId: "someone_else"` -> `PERMISSION_DENIED` (`incoming().ownerId == request.auth.uid`).
7. **Inquiry Status Shortcutting**: Regular user creates inquiry with `status: "Closed"` or updates `status: "Quoted"` -> `PERMISSION_DENIED`.
8. **ID Poisoning Attack**: Document ID with spaces/slashes or 1.5KB string -> `PERMISSION_DENIED` (`isValidId()`).
9. **Resource Exhaustion / Value Poisoning**: Product `description` > 1000 chars or `price: "free"` -> `PERMISSION_DENIED`.
10. **Client Timestamp Tampering**: `createdAt` set to past/future client timestamp instead of `request.time` -> `PERMISSION_DENIED`.
11. **Immortal Field Mutation**: Attempting to alter `createdAt` or `ownerId` on update -> `PERMISSION_DENIED`.
12. **Unauthenticated Admin Catalog Mutation**: Unauthenticated or non-admin user tries to create/update/delete `/products`, `/services`, `/brands`, `/projects`, `/gallery`, `/testimonials`, or `/siteSettings` -> `PERMISSION_DENIED`.
