# MeroProfile - Business & Professional Directory Platform

A comprehensive web platform for discovering and connecting with businesses, professionals, and services across Nepal.

## 🌟 Features

### Core Features
- **Business Profiles**: Complete business listings with banner, logo, gallery, services, and location
- **Professional Profiles**: Professional listings for doctors, consultants, and service providers
- **Featured Plans**: Premium visibility with offline payment system
- **Search & Filtering**: Advanced search by category, location, price range, and tags
- **Reviews System**: User reviews with profanity filtering
- **Analytics**: Track visits, clicks, and searches
- **Responsive Design**: Mobile-first, fully responsive interface
- **SEO Optimized**: SEO-friendly URLs and meta tags

### User Features
- Email/Password authentication
- Social login (Google, Facebook)
- Email verification
- Password reset
- Profile management
- Review submission

### Admin Features
- Featured plan approval system
- Review moderation
- Analytics dashboard

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Database**: PostgreSQL with Row Level Security

## 📋 Prerequisites

- Supabase account
- Modern web browser
- Text editor or IDE
- Basic knowledge of HTML, CSS, JavaScript

## 🚀 Setup Instructions

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

#### Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables, indexes, and RLS policies

#### Create Storage Bucket
1. Go to Storage in Supabase dashboard
2. Create a new bucket named `MeroProfile`
3. Set bucket to **Public**
4. Configure the following policies:
   - Allow authenticated users to upload
   - Allow public read access

#### Enable Authentication Providers
1. Go to Authentication > Providers
2. Enable Email provider
3. (Optional) Enable Google OAuth:
   - Add Google Client ID and Secret
   - Configure authorized redirect URLs
4. (Optional) Enable Facebook OAuth:
   - Add Facebook App ID and Secret
   - Configure authorized redirect URLs

### 2. Project Configuration

#### Update Configuration File
Edit `config.js` and replace with your Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_PROJECT_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

#### Update Bank Details (Optional)
In `config.js`, update bank details for featured plan payments:

```javascript
const BANK_DETAILS = {
    bankName: 'Your Bank Name',
    accountName: 'MeroProfile',
    accountNumber: '1234567890',
    branch: 'Kathmandu Branch'
};
```

### 3. Add Logo and Assets

1. Add your logo as `assets/images/MeroProfile-Logo.png`
2. Add favicon as `assets/images/favicon.png`
3. Add Open Graph image as `assets/images/og-image.jpg`

### 4. Local Development

#### Using Python HTTP Server
```bash
python -m http.server 8000
```

#### Using Node.js HTTP Server
```bash
npx http-server -p 8000
```

#### Using PHP Built-in Server
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### 5. Deployment

#### Deploy to Netlify
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Deploy with default settings
4. Update Supabase redirect URLs

#### Deploy to Vercel
1. Push code to GitHub repository
2. Import project in Vercel
3. Deploy with default settings
4. Update Supabase redirect URLs

#### Deploy to GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Update Supabase redirect URLs

## 📁 Project Structure

```
meroprofile/
├── assets/
│   ├── images/          # Images and icons
│   └── icons/           # Icon files
├── components/
│   ├── header.html      # Header component
│   └── footer.html      # Footer component
├── css/
│   ├── styles.css       # Global styles
│   ├── homepage.css     # Homepage styles
│   └── create-profile.css # Profile creation styles
├── js/
│   ├── supabase-client.js # Supabase client
│   ├── utils.js         # Utility functions
│   ├── homepage.js      # Homepage logic
│   └── create-profile.js # Profile creation logic
├── pages/
│   ├── create-profile.html
│   ├── profile.html
│   ├── search.html
│   ├── featured.html
│   └── ... (other pages)
├── config.js            # Configuration
├── index.html           # Homepage
├── supabase-schema.sql  # Database schema
└── README.md            # This file
```

## 🔐 Security Features

- Row Level Security (RLS) policies
- Input sanitization to prevent XSS
- Image upload validation
- File size limits (5MB)
- Allowed file types (images only)
- Profanity filtering for reviews
- User authentication required for actions

## 📊 Database Schema

### Main Tables
- **users**: User profiles
- **businesses**: Business listings
- **professionals**: Professional profiles
- **categories**: Business categories
- **tags**: Service tags
- **reviews**: User reviews
- **featured_profiles**: Featured plan requests
- **analytics**: Analytics tracking
- **services**: Business/professional services
- **images**: Gallery images

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --accent-color: #f59e0b;
    /* ... more colors */
}
```

### Categories
Edit `CATEGORIES` array in `config.js`:

```javascript
const CATEGORIES = [
    'Restaurant',
    'Cafe',
    // Add more categories
];
```

### Cities
Edit `CITIES` array in `config.js`:

```javascript
const CITIES = [
    'Kathmandu',
    'Pokhara',
    // Add more cities
];
```

## 📱 Features to Implement

### Completed ✅
- User authentication
- Business profile creation
- Professional profile creation
- Homepage with featured profiles
- Category browsing
- Search functionality
- Image upload
- Reviews system
- Featured plans

### Pending 🚧
- Profile editing
- Search results page
- Profile detail page
- Featured plan payment workflow
- Admin dashboard
- Analytics dashboard
- Email notifications
- PWA support

## 🐛 Troubleshooting

### Images not uploading
- Check storage bucket is public
- Verify file size is under 5MB
- Ensure file type is allowed (JPG, PNG, WebP)

### Authentication not working
- Verify Supabase URL and anon key
- Check email provider is enabled
- Confirm redirect URLs are configured

### Database errors
- Ensure schema is properly executed
- Check RLS policies are enabled
- Verify user has proper permissions

## 📞 Support

For issues and questions:
- Check documentation
- Review Supabase logs
- Inspect browser console for errors

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- Unsplash for placeholder images
- Icons from various sources

## 🔄 Updates

### Version 1.0.0 (Current)
- Initial release
- Core features implemented
- Basic functionality working

---

Made with ❤️ in Nepal