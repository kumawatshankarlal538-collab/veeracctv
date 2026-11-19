/**
 * Phase 0 Payload-First Security Spec Verification Matrix
 * Verifies Dirty Dozen adversarial cases against VEERA CCTV Firestore schema & rule invariants.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  expected: 'PERMISSION_DENIED';
  reason: string;
}

export const DIRTY_DOZEN_CASES: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Product Create',
    collection: 'products',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'keys().hasOnly(...) rejects unallowed ghost field isVerified',
  },
  {
    id: 2,
    name: 'Self-Assigned Admin Role on User Registration',
    collection: 'users',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'User create mandates role == "customer" unless isAdmin()',
  },
  {
    id: 3,
    name: 'Privilege Escalation via User Update',
    collection: 'users',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    reason: 'User update affectedKeys().hasOnly(["displayName", "phone", "updatedAt"]) blocks role change',
  },
  {
    id: 4,
    name: 'Email Spoofing (Unverified Email Token)',
    collection: 'products',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'isAdmin() requires request.auth.token.email_verified == true',
  },
  {
    id: 5,
    name: 'PII Blanket Read on Users Collection',
    collection: 'users',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    reason: 'Only isOwner(userId) or isAdmin() may read PII user documents',
  },
  {
    id: 6,
    name: 'Inquiry Identity Spoofing',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Inquiry create mandates incoming().ownerId == request.auth.uid',
  },
  {
    id: 7,
    name: 'Inquiry Status Shortcutting',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Inquiry create mandates status == "New"',
  },
  {
    id: 8,
    name: 'ID Poisoning Attack',
    collection: 'products',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'isValidId() enforces ^[a-zA-Z0-9_\\-]+$ and <= 128 chars',
  },
  {
    id: 9,
    name: 'Value Poisoning on Product Description',
    collection: 'products',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    reason: 'isValidProduct() enforces size() <= 1000 and numeric price >= 0',
  },
  {
    id: 10,
    name: 'Client Timestamp Tampering',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'createdAt == request.time and updatedAt == request.time enforced',
  },
  {
    id: 11,
    name: 'Immortal Field Mutation',
    collection: 'inquiries',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    reason: 'createdAt == existing().createdAt and ownerId == existing().ownerId enforced',
  },
  {
    id: 12,
    name: 'Unauthorized Catalog Deletion',
    collection: 'services',
    operation: 'delete',
    expected: 'PERMISSION_DENIED',
    reason: 'Catalog delete strictly requires isAdmin()',
  },
];
