// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL', // Replace with your Supabase project URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your Supabase anon key
};

// Storage Configuration
const STORAGE_CONFIG = {
    bucketName: 'MeroProfile',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

// Featured Plans Configuration
const FEATURED_PLANS = {
    '1_month': { duration: 30, price: 1500, label: '1 Month' },
    '3_months': { duration: 90, price: 4000, label: '3 Months' },
    '6_months': { duration: 180, price: 6000, label: '6 Months' },
    '12_months': { duration: 365, price: 10000, label: '12 Months' }
};

// Bank Details for Payment
const BANK_DETAILS = {
    bankName: 'Your Bank Name',
    accountName: 'MeroProfile',
    accountNumber: '1234567890',
    branch: 'Kathmandu Branch'
};

// Categories Configuration
const CATEGORIES = [
    'Restaurant',
    'Cafe',
    'Doctor',
    'Clinic',
    'Hospital',
    'Salon',
    'Spa',
    'Gym',
    'Hotel',
    'Shop',
    'Service',
    'Education',
    'Real Estate',
    'Automotive',
    'Technology',
    'Other'
];

// Cities in Nepal (Limited to 5 cities)
const CITIES = [
    'Birgunj',
    'Hetauda',
    'Butwal',
    'Janakpur',
    'Rajbiraj'
];

// Price Ranges
const PRICE_RANGES = [
    'Budget (Rs 0-500)',
    'Moderate (Rs 500-2000)',
    'Premium (Rs 2000-5000)',
    'Luxury (Rs 5000+)'
];

// Profanity Filter Words (Basic - expand as needed)
const PROFANITY_WORDS = [
    'badword1',
    'badword2',
    // Add more words as needed
];

// Review Configuration
const REVIEW_CONFIG = {
    maxLength: 200,
    minLength: 10
};

// SEO Configuration
const SEO_CONFIG = {
    siteName: 'MeroProfile',
    siteDescription: 'Discover and connect with businesses, professionals, and services in Nepal',
    siteUrl: 'https://meroprofile.com',
    defaultImage: '/assets/images/og-image.jpg'
};