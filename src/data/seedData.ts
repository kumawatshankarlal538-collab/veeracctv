import type {
  BrandItem,
  GalleryPhotoItem,
  ProductItem,
  ProjectItem,
  ServiceItem,
  SiteSettingsData,
  TestimonialItem,
} from '../types/cctv';

export const ASSET_IMAGES = {
  heroControlRoom: '/src/assets/images/hero_security_command_1795064086299.jpg',
  aboutPole: '/src/assets/images/about_cctv_pole_1795064085755.jpg',
  domeKit: '/src/assets/images/product_dome_camera_1795064086287.jpg',
  ptzBullet: '/src/assets/images/product_ptz_bullet_1795064086535.jpg',
  commercialSite: '/src/assets/images/project_commercial_surveillance_1795064086021.jpg',
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  companyName: 'VEERA CCTV',
  promoBanner: 'Complimentary on-site blind-spot audit on new 8+ camera installations',
  phone: '+91 98290 44510',
  whatsapp: '919829044510',
  email: 'contact@veeracctv.com',
  address: '42 Security Enclave, Industrial Estate, Jaipur, RJ 302013',
  experienceYears: 15,
  heroHeadline: 'PROFESSIONAL CCTV INSTALLATION AND SECURITY SERVICES',
  heroSubheadline:
    'Protect your residence, warehouse, or commercial campus with 4K AI surveillance systems engineered for round-the-clock clarity and rapid response.',
  aboutHeadline: 'UNMATCHED SURVEILLANCE, UNRIVALED PROTECTION',
  aboutDescription:
    'Unmatched surveillance starts with disciplined engineering. From optical lens calibration and shielded PoE cabling to redundant NVR RAID storage, VEERA CCTV builds reliable security infrastructure backed by certified field engineers.',
  heroImageUrl: ASSET_IMAGES.heroControlRoom,
  aboutImageUrl: ASSET_IMAGES.aboutPole,
};

export const SEED_SERVICES: ServiceItem[] = [
  {
    id: 'srv-installation',
    title: 'CCTV Installation',
    description:
      'Turnkey indoor and outdoor camera deployment with concealed conduit cabling, PoE switching, and mobile live-view setup.',
    icon: 'Camera',
    category: 'Deployment',
    features: ['Concealed armored cabling', 'IP67 weatherproof mounting', 'Mobile & desktop app sync'],
    imageUrl: ASSET_IMAGES.aboutPole,
    order: 1,
  },
  {
    id: 'srv-system-design',
    title: 'System Design',
    description:
      'CAD-mapped camera placement and focal-length planning to eliminate perimeter blind spots across multi-floor facilities.',
    icon: 'Network',
    category: 'Engineering',
    features: ['3D blind-spot audit', 'Bandwidth & storage sizing', 'Night-vision lux mapping'],
    imageUrl: ASSET_IMAGES.heroControlRoom,
    order: 2,
  },
  {
    id: 'srv-maintenance',
    title: 'AMC & Maintenance',
    description:
      'Scheduled lens cleaning, firmware hardening, HDD health diagnostics, and rapid 4-hour on-site hardware replacement.',
    icon: 'Wrench',
    category: 'Support',
    features: ['Quarterly preventive audits', 'HDD SMART health alerts', 'Priority loaner hardware'],
    imageUrl: ASSET_IMAGES.domeKit,
    order: 3,
  },
  {
    id: 'srv-monitoring',
    title: '24/7 Monitoring',
    description:
      'Centralized multi-site VMS command wall integration with AI perimeter intrusion alerts and automated event tagging.',
    icon: 'MonitorCheck',
    category: 'Operations',
    features: ['AI line-crossing alerts', 'Multi-branch VMS wall', 'Cloud backup failover'],
    imageUrl: ASSET_IMAGES.heroControlRoom,
    order: 4,
  },
  {
    id: 'srv-access-control',
    title: 'Access Control',
    description:
      'Biometric face terminals, RFID door controllers, and ANPR boom barriers synchronized with live CCTV event logs.',
    icon: 'ShieldCheck',
    category: 'Access',
    features: ['Face & RFID attendance', 'Vehicle ANPR gate capture', 'Time-zone door rules'],
    imageUrl: ASSET_IMAGES.ptzBullet,
    order: 5,
  },
  {
    id: 'srv-consulting',
    title: 'Enterprise Audits',
    description:
      'Security compliance reviews, legacy analog-to-IP migration plans, and redundant fiber backbone upgrades.',
    icon: 'Headset',
    category: 'Advisory',
    features: ['Zero-downtime IP migration', '90-day retention planning', 'Compliance documentation'],
    imageUrl: ASSET_IMAGES.commercialSite,
    order: 6,
  },
];

export const SEED_BRANDS: BrandItem[] = [
  {
    id: 'brand-hikvision',
    name: 'Hikvision',
    tagline: 'AcuSense & ColorVu 4K IP Surveillance',
    description:
      'Authorized system integrator for Hikvision ColorVu low-light cameras, AcuSense AI NVRs, and enterprise thermal perimeter domes.',
    imageUrl: ASSET_IMAGES.ptzBullet,
    country: 'Global Enterprise Partner',
    warrantyYears: 3,
  },
  {
    id: 'brand-dahua',
    name: 'Dahua',
    tagline: 'WizSense Smart Motion & TiOC Deterrence',
    description:
      'Full-color active deterrence cameras, PoE NVR recorders, and intelligent video analytics tailored for commercial sites.',
    imageUrl: ASSET_IMAGES.domeKit,
    country: 'Authorized Tier-1 Dealer',
    warrantyYears: 3,
  },
  {
    id: 'brand-bosch',
    name: 'Bosch',
    tagline: 'Mission-Critical Industrial Video Systems',
    description:
      'Ruggedized Starlight IP cameras with built-in Essential Video Analytics for logistics hubs, banks, and campuses.',
    imageUrl: ASSET_IMAGES.heroControlRoom,
    country: 'Germany Engineering',
    warrantyYears: 5,
  },
  {
    id: 'brand-honeywell',
    name: 'Honeywell',
    tagline: 'NDAA-Compliant Commercial Security',
    description:
      'Enterprise 35 Series & 60 Series IP cameras built for hospitals, hospitality chains, and high-compliance workplaces.',
    imageUrl: ASSET_IMAGES.aboutPole,
    country: 'USA Security Standards',
    warrantyYears: 3,
  },
  {
    id: 'brand-cp-plus',
    name: 'CP Plus',
    tagline: 'Reliable HD & IP Surveillance Kits',
    description:
      'Cost-effective 4CH to 32CH Guard+ and Indigo IP packages engineered for retail stores, offices, and residences.',
    imageUrl: ASSET_IMAGES.domeKit,
    country: 'India Nationwide Support',
    warrantyYears: 2,
  },
  {
    id: 'brand-axis',
    name: 'Axis Communications',
    tagline: 'Network Video & Cybersecurity Leader',
    description:
      'Signed-firmware network cameras, multi-sensor panoramic domes, and perimeter radar integration.',
    imageUrl: ASSET_IMAGES.ptzBullet,
    country: 'Sweden Precision Optics',
    warrantyYears: 5,
  },
];

export const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-veera-4k-kit',
    name: 'Veera Pro 8-Channel 4K IP Surveillance Kit',
    brand: 'Hikvision',
    category: 'Complete Kit',
    resolution: '4K Ultra HD (8MP)',
    price: 42500,
    description:
      'Complete turnkey 8-camera PoE surveillance bundle featuring 6 weatherproof 8MP bullet cameras, 2 vandal-resistant dome cameras, an 8CH 4K PoE NVR, and 4TB surveillance-grade storage.',
    specs: ['8MP ColorVu 24/7 night color', '4TB Purple Surveillance HDD', 'H.265+ compression', 'Remote iOS/Android viewing'],
    imageUrl: ASSET_IMAGES.domeKit,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-ptz-36x',
    name: 'AcuSense 36x Optical Zoom Outdoor PTZ Dome',
    brand: 'Hikvision',
    category: 'PTZ Camera',
    resolution: '4MP DarkFighter',
    price: 38900,
    description:
      'High-speed motorized Pan-Tilt-Zoom dome with 36x optical zoom, 200m laser IR night vision, and automated human/vehicle auto-tracking for large yards and highways.',
    specs: ['360° endless pan & 36x zoom', '200m smart IR range', 'IP66 + IK10 weather & impact proof', 'Auto-tracking AI'],
    imageUrl: ASSET_IMAGES.ptzBullet,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-dual-bullet',
    name: 'Dual-Lens Perimeter Starlight Bullet Camera',
    brand: 'Axis Communications',
    category: 'Bullet Camera',
    resolution: '6MP Dual-Sensor',
    price: 24800,
    description:
      'Heavy-duty dual-lens infrared bullet camera engineered for loading docks, gated entryways, and zero-light industrial corridors.',
    specs: ['120dB True WDR', '60m adaptive IR array', 'PoE+ & microSD edge failover', 'Built-in tamper alarm'],
    imageUrl: ASSET_IMAGES.ptzBullet,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-dome-ai',
    name: 'WizSense 5MP Anti-Vandal Interior Dome',
    brand: 'Dahua',
    category: 'Dome Camera',
    resolution: '5MP Starlight',
    price: 6850,
    description:
      'Low-profile IK10 vandal-resistant dome camera with built-in dual mic, perimeter intrusion filtering, and crisp wide-angle lobby coverage.',
    specs: ['2.8mm wide 108° FOV', 'IK10 metal housing', 'SMD Plus human/vehicle filter', 'Built-in mic'],
    imageUrl: ASSET_IMAGES.domeKit,
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-nvr-32ch',
    name: 'Enterprise 32-Channel Dual-LAN 4K NVR',
    brand: 'Bosch',
    category: 'NVR / DVR',
    resolution: 'Up to 12MP Decode',
    price: 54000,
    description:
      'Rackmount 4-bay 32-channel Network Video Recorder supporting RAID-5 failover, dual Gigabit uplinks, and simultaneous HDMI/VGA control room output.',
    specs: ['4 SATA bays up to 40TB', '320 Mbps incoming bandwidth', 'RAID 0/1/5/10 redundancy', 'Dual Gigabit NIC'],
    imageUrl: ASSET_IMAGES.heroControlRoom,
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-pole-mast',
    name: '6-Camera Galvanized Perimeter Mast Assembly',
    brand: 'Honeywell',
    category: 'Access Control',
    resolution: '4K Multi-Directional',
    price: 68000,
    description:
      'Pre-wired galvanized steel pole assembly with weatherproof junction box, surge protection, and 6 directional 4K IP cameras for campus intersections.',
    specs: ['360° zero-blindspot mast', '6kV surge & lightning guard', 'Fiber + PoE switch enclosure', 'IP67 sealed conduit'],
    imageUrl: ASSET_IMAGES.aboutPole,
    inStock: true,
    featured: true,
  },
];

export const SEED_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-hotel-crown',
    title: 'Grand Meridian Luxury Hotel & Banquet',
    industry: 'Hotel',
    location: 'Jaipur, Rajasthan',
    camerasInstalled: 128,
    completionYear: '2025',
    summary:
      'Full 4K IP surveillance across lobby, valet drop-off, service elevators, and rooftop pool decks integrated with central front-office monitoring.',
    outcomeMetric: '99.98% uptime across 128 cameras',
    imageUrl: ASSET_IMAGES.heroControlRoom,
  },
  {
    id: 'proj-property-estates',
    title: 'Silverstone Gated Villas & Clubhouse',
    industry: 'Property',
    location: 'Gurugram, Haryana',
    camerasInstalled: 84,
    completionYear: '2025',
    summary:
      'Perimeter mast surveillance with ANPR license-plate gate cameras and resident mobile gate-verification integration.',
    outcomeMetric: '42% faster visitor gate clearance',
    imageUrl: ASSET_IMAGES.aboutPole,
  },
  {
    id: 'proj-distribution-hub',
    title: 'Novatech 24-Bay Cold Chain Logistics Hub',
    industry: 'Distribution',
    location: 'Bhiwandi, Maharashtra',
    camerasInstalled: 196,
    completionYear: '2026',
    summary:
      'High-bay warehouse aisle coverage, 24 loading dock parcel-tracking cameras, and dual-NVR 90-day RAID retention.',
    outcomeMetric: 'Zero unverified dock discrepancies',
    imageUrl: ASSET_IMAGES.commercialSite,
  },
  {
    id: 'proj-school-academy',
    title: 'St. Xavier International Campus',
    industry: 'Schools',
    location: 'Udaipur, Rajasthan',
    camerasInstalled: 112,
    completionYear: '2025',
    summary:
      'Corridor, bus bay, and campus boundary monitoring with privacy-masked classroom feeds and instant principal desk alerts.',
    outcomeMetric: '100% bus bay & entry coverage',
    imageUrl: ASSET_IMAGES.ptzBullet,
  },
];

export const SEED_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-rajesh',
    clientName: 'Rajesh Sharma',
    role: 'Chief Operations Officer',
    company: 'Novatech Logistics Pvt. Ltd.',
    quote:
      'Before VEERA CCTV redesigned our loading bays, blind spots caused weekly dispatch disputes. Within 10 days of commissioning 196 4K cameras, every bay has crystal-clear timestamped recall.',
    rating: 5,
    projectType: 'Warehouse & Fleet Surveillance',
  },
  {
    id: 'test-meera',
    clientName: 'Meera Rathore',
    role: 'General Manager',
    company: 'Grand Meridian Hospitality',
    quote:
      'Their technicians pulled shielded cabling through heritage stonework without disrupting a single guest floor. The central security desk runs effortlessly 24/7.',
    rating: 5,
    projectType: '128-Camera Hotel Deployment',
  },
  {
    id: 'test-vikram',
    clientName: 'Vikramaditya Singh',
    role: 'Estate Director',
    company: 'Silverstone Residences',
    quote:
      'Our previous vendor left half our perimeter dark after rainstorms. VEERA CCTV installed surge-protected galvanized masts and ColorVu optics that capture plates clearly even at 2 AM.',
    rating: 5,
    projectType: 'Gated Community Perimeter',
  },
  {
    id: 'test-ananya',
    clientName: 'Dr. Ananya Verma',
    role: 'Campus Principal',
    company: 'St. Xavier Academy',
    quote:
      'Their Annual Maintenance Contract keeps every NVR and bus-bay camera verified with monthly health reports. Truly dependable long-term partners.',
    rating: 5,
    projectType: 'School Campus Security',
  },
];

export const SEED_GALLERY: GalleryPhotoItem[] = [
  {
    id: 'gal-command-wall',
    title: '24/7 Multi-Site Security Command Room',
    category: 'Control Rooms',
    caption: 'Dual-operator VMS video wall monitoring 196 live IP camera feeds with zero-latency fiber uplinks.',
    imageUrl: ASSET_IMAGES.heroControlRoom,
  },
  {
    id: 'gal-perimeter-mast',
    title: '6-Way Galvanized Perimeter Mast',
    category: 'Installations',
    caption: '360-degree directional bullet camera cluster mounted for industrial yard intersections.',
    imageUrl: ASSET_IMAGES.aboutPole,
  },
  {
    id: 'gal-4k-kit',
    title: '8-Channel 4K PoE NVR Bundle',
    category: 'Hardware',
    caption: 'Pre-tested 8MP dome & bullet array with Cat6 armored patch cords and NVR unit.',
    imageUrl: ASSET_IMAGES.domeKit,
  },
  {
    id: 'gal-ptz-bullet',
    title: 'Motorized 36x PTZ & Dual-Lens Bullet',
    category: 'Hardware',
    caption: 'Weatherproof IP67 outdoor optics ready for high-contrast twilight and night capture.',
    imageUrl: ASSET_IMAGES.ptzBullet,
  },
  {
    id: 'gal-warehouse-dusk',
    title: 'Novatech Logistics Exterior Deployment',
    category: 'Commercial',
    caption: '24 loading docks and perimeter guardhouse linked to redundant RAID NVR racks.',
    imageUrl: ASSET_IMAGES.commercialSite,
  },
  {
    id: 'gal-residential-entry',
    title: 'Villa Perimeter & Gate Optical Array',
    category: 'Residential',
    caption: 'Discreet color-night-vision cameras securing driveway gates and courtyard entries.',
    imageUrl: ASSET_IMAGES.aboutPole,
  },
];
