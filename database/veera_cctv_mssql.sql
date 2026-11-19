-- ============================================================================
-- VEERA CCTV — Microsoft SQL Server (SSMS / T-SQL) Database Schema & Seed Script
-- Compatible with SQL Server 2019 / 2022 & SQL Server Management Studio (SSMS)
-- ============================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'VeeraCCTV_DB')
BEGIN
    CREATE DATABASE VeeraCCTV_DB;
END
GO

USE VeeraCCTV_DB;
GO

-- 1. Users & Role-Based Authorization Table
IF OBJECT_ID('dbo.Users', 'U') IS NULL
CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Phone NVARCHAR(30) NULL,
    PasswordHash NVARCHAR(255) NOT NULL, -- bcrypt hash ($2b$12$...)
    Role NVARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (Role IN ('customer', 'admin')),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 2. Password Reset Tokens
IF OBJECT_ID('dbo.PasswordResetTokens', 'U') IS NULL
CREATE TABLE dbo.PasswordResetTokens (
    TokenId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    ResetToken NVARCHAR(128) NOT NULL UNIQUE,
    ExpiresAt DATETIME2 NOT NULL,
    UsedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 3. Services Table
IF OBJECT_ID('dbo.Services', 'U') IS NULL
CREATE TABLE dbo.Services (
    ServiceId INT IDENTITY(1,1) PRIMARY KEY,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Title NVARCHAR(100) NOT NULL,
    Category NVARCHAR(60) NOT NULL,
    IconName NVARCHAR(40) NOT NULL,
    Description NVARCHAR(600) NOT NULL,
    FeaturesJson NVARCHAR(MAX) NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    DisplayOrder INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 4. Brands Table
IF OBJECT_ID('dbo.Brands', 'U') IS NULL
CREATE TABLE dbo.Brands (
    BrandId INT IDENTITY(1,1) PRIMARY KEY,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Name NVARCHAR(60) NOT NULL,
    Tagline NVARCHAR(140) NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    Country NVARCHAR(60) NOT NULL,
    WarrantyYears INT NOT NULL DEFAULT 2,
    ImageUrl NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 5. CCTV Products Table
IF OBJECT_ID('dbo.Products', 'U') IS NULL
CREATE TABLE dbo.Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Name NVARCHAR(120) NOT NULL,
    BrandName NVARCHAR(60) NOT NULL,
    Category NVARCHAR(40) NOT NULL CHECK (Category IN ('Dome Camera', 'Bullet Camera', 'PTZ Camera', 'NVR / DVR', 'Complete Kit', 'Access Control')),
    Resolution NVARCHAR(40) NOT NULL,
    Price DECIMAL(12, 2) NOT NULL CHECK (Price >= 0),
    Description NVARCHAR(1000) NOT NULL,
    SpecsJson NVARCHAR(MAX) NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    InStock BIT NOT NULL DEFAULT 1,
    Featured BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 6. Projects Table
IF OBJECT_ID('dbo.Projects', 'U') IS NULL
CREATE TABLE dbo.Projects (
    ProjectId INT IDENTITY(1,1) PRIMARY KEY,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Title NVARCHAR(120) NOT NULL,
    Industry NVARCHAR(40) NOT NULL CHECK (Industry IN ('Hotel', 'Property', 'Distribution', 'Schools', 'Industrial', 'Retail')),
    Location NVARCHAR(100) NOT NULL,
    CamerasInstalled INT NOT NULL DEFAULT 1,
    CompletionYear NVARCHAR(10) NOT NULL,
    Summary NVARCHAR(800) NOT NULL,
    OutcomeMetric NVARCHAR(120) NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 7. Photo Gallery Table
IF OBJECT_ID('dbo.GalleryPhotos', 'U') IS NULL
CREATE TABLE dbo.GalleryPhotos (
    PhotoId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Category NVARCHAR(40) NOT NULL CHECK (Category IN ('Installations', 'Hardware', 'Control Rooms', 'Commercial', 'Residential')),
    Caption NVARCHAR(300) NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 8. Testimonials Table
IF OBJECT_ID('dbo.Testimonials', 'U') IS NULL
CREATE TABLE dbo.Testimonials (
    TestimonialId INT IDENTITY(1,1) PRIMARY KEY,
    ClientName NVARCHAR(80) NOT NULL,
    ClientRole NVARCHAR(80) NOT NULL,
    Company NVARCHAR(100) NOT NULL,
    Quote NVARCHAR(600) NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    ProjectType NVARCHAR(80) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 9. Quote & Contact Inquiries Table
IF OBJECT_ID('dbo.Inquiries', 'U') IS NULL
CREATE TABLE dbo.Inquiries (
    InquiryId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL FOREIGN KEY REFERENCES dbo.Users(UserId) ON DELETE SET NULL,
    CustomerName NVARCHAR(80) NOT NULL,
    Email NVARCHAR(120) NOT NULL,
    Phone NVARCHAR(30) NOT NULL,
    ServiceType NVARCHAR(80) NOT NULL,
    PropertyType NVARCHAR(80) NOT NULL,
    Message NVARCHAR(1500) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'New' CHECK (Status IN ('New', 'In Review', 'Quoted', 'Closed')),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 10. Site Settings Table
IF OBJECT_ID('dbo.SiteSettings', 'U') IS NULL
CREATE TABLE dbo.SiteSettings (
    SettingKey NVARCHAR(50) PRIMARY KEY,
    CompanyName NVARCHAR(60) NOT NULL,
    PromoBanner NVARCHAR(160) NOT NULL,
    Phone NVARCHAR(30) NOT NULL,
    WhatsApp NVARCHAR(30) NOT NULL,
    Email NVARCHAR(120) NOT NULL,
    Address NVARCHAR(200) NOT NULL,
    ExperienceYears INT NOT NULL DEFAULT 15,
    HeroHeadline NVARCHAR(160) NOT NULL,
    HeroSubheadline NVARCHAR(400) NOT NULL,
    AboutHeadline NVARCHAR(160) NOT NULL,
    AboutDescription NVARCHAR(800) NOT NULL,
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Seed SiteSettings
IF NOT EXISTS (SELECT 1 FROM dbo.SiteSettings WHERE SettingKey = 'main')
BEGIN
    INSERT INTO dbo.SiteSettings (
        SettingKey, CompanyName, PromoBanner, Phone, WhatsApp, Email, Address,
        ExperienceYears, HeroHeadline, HeroSubheadline, AboutHeadline, AboutDescription
    ) VALUES (
        'main',
        'VEERA CCTV',
        'Get 20% off professional site survey & new multi-camera installation',
        '+91 98290 44510',
        '+919829044510',
        'contact@veeracctv.com',
        '42 Security Enclave, Industrial Estate, Jaipur, RJ 302013',
        15,
        'PROFESSIONAL CCTV INSTALLATION AND SECURITY SERVICES',
        'Keep your home, warehouse, or commercial enterprise safe with 4K AI surveillance systems engineered for 24/7 visibility and peace of mind.',
        'UNMATCHED SURVEILLANCE, UNRIVALED PROTECTION',
        'VEERA CCTV delivers end-to-end commercial and residential surveillance engineering. Every camera angle, fiber uplink, and NVR storage array is meticulously commissioned by certified technicians.'
    );
END
GO
