# MeroProfile - Quick Setup Guide

Follow these steps to get MeroProfile up and running.

## Step 1: Supabase Setup (15 minutes)

### 1.1 Create Supabase Project
1. Visit [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - Name: MeroProfile
   - Database Password: (create a strong password)
   - Region: (choose closest to Nepal)
4. Wait for project to be created (2-3 minutes)

### 1.2 Execute Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase-schema.sql` from the project
4. Copy all contents and paste into SQL Editor
5. Click "Run" to execute
6. You should see "Success. No rows returned"

### 1.3 Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name: `MeroProfile`
4. Set as **Public bucket** ✓
5. Click "Create bucket"

### 1.4 Configure Storage Policies
1. Click on the `MeroProfile` bucket
2. Go to "Policies" tab
3. Add policy for uploads:
   - Policy name: "Allow authenticated uploads"
   - Allowed operation: INSERT
   - Target roles: authenticated
   - Policy definition: `true`
4. Public access is already enabled (bucket is public)

### 1.5 Enable Authentication
1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. (Optional) Enable **Google OAuth**:
   - Get credentials from Google Cloud Console
   - Add Client ID and Secret
   - Add authorized redirect URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. (Optional) Enable **Facebook OAuth**:
   - Get credentials from Facebook Developers
   - Add App ID and Secret
   - Add authorized redirect URL

### 1.6 Get API Credentials
1. Go to **Settings** > **API**
2. Copy these values:
   - Project URL
   - anon public key

## Step 2: Project Configuration (5 minutes)

### 2.1 Update config.js
1. Open `config.js` in your text editor
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://YOUR_PROJECT_REF.supabase.co', // Paste your Project URL
    anonKey: 'YOUR_ANON_KEY_HERE' // Paste your anon public key
};
```

### 2.2 Update Bank Details (for Featured Plans)
In `config.js`, update:

```javascript
const BANK_DETAILS = {
    bankName: 'Your Bank Name',
    accountName: 'MeroProfile',
    accountNumber: '1234567890',
    branch: 'Kathmandu Branch'
};
```

### 2.3 Add Logo and Assets
1. Add your logo as `assets/images/MeroProfile-Logo.png`
2. Add favicon as `assets/images/favicon.png`
3. Add OG image as `assets/images/og-image.jpg`

## Step 3: Local Testing (5 minutes)

### Option A: Python (Recommended)
```bash
# Navigate to project directory
cd meroprofile

# Start server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Option B: Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Start server
http-server -p 8000

# Open browser to http://localhost:8000
```

### Option C: PHP
```bash
php -S localhost:8000
```

## Step 4: Test Core Features (10 minutes)

### 4.1 Test Registration
1. Click "Sign Up" in header
2. Create a test account
3. Check email for verification link
4. Verify email

### 4.2 Test Login
1. Click "Login"
2. Enter credentials
3. Verify you're logged in

### 4.3 Test Profile Creation
1. Click "Create Profile"
2. Choose "Business Profile"
3. Fill in all required fields:
   - Business Name
   - Category
   - Description
   - Upload Banner (any image)
   - Upload Logo (any image)
   - Address
   - City
   - Phone
4. Click "Create Business Profile"
5. Wait for upload to complete
6. Verify profile is created

### 4.4 Test Search
1. Use search bar in header
2. Search for your business
3. Verify it appears in results

## Step 5: Deploy to Production (15 minutes)

### Option A: Netlify (Easiest)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub repository
   - Click "Deploy site"
   - Wait 2-3 minutes

3. **Update Supabase Redirect URLs**
   - Copy your Netlify URL (e.g., `https://your-site.netlify.app`)
   - Go to Supabase > Authentication > URL Configuration
   - Add to "Redirect URLs": `https://your-site.netlify.app/**`
   - Add to "Site URL": `https://your-site.netlify.app`

4. **Test Production Site**
   - Visit your Netlify URL
   - Test registration and login
   - Verify all features work

### Option B: Vercel

1. **Create GitHub Repository** (same as above)

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Update Supabase Redirect URLs** (same as Netlify)

## Common Issues & Solutions

### Issue: Images not uploading
**Solution**: 
- Check storage bucket is public
- Verify file size is under 5MB
- Ensure file is an image (JPG, PNG, WebP)

### Issue: Authentication not working
**Solution**:
- Verify Supabase URL and key in config.js
- Check redirect URLs in Supabase
- Clear browser cache and try again

### Issue: Database errors
**Solution**:
- Verify schema was executed successfully
- Check RLS policies are enabled
- Review Supabase logs for errors

### Issue: Profile not appearing
**Solution**:
- Check if profile was created successfully
- Verify is_published is true
- Check browser console for errors

## Next Steps

After successful setup:

1. **Customize Design**
   - Update colors in `css/styles.css`
   - Add your branding
   - Customize categories and cities

2. **Add Content**
   - Create sample profiles
   - Add featured profiles
   - Test all features

3. **Configure SEO**
   - Update meta tags
   - Submit to Google Search Console
   - Add Google Analytics

4. **Set Up Monitoring**
   - Monitor Supabase usage
   - Set up error tracking
   - Review user feedback

## Support Resources

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Project README**: See `README.md` for detailed documentation
- **Deployment Guide**: See `DEPLOYMENT.md` for deployment options

## Estimated Time

- Supabase Setup: 15 minutes
- Project Configuration: 5 minutes
- Local Testing: 5 minutes
- Feature Testing: 10 minutes
- Deployment: 15 minutes

**Total: ~50 minutes**

---

Congratulations! Your MeroProfile platform is now ready to use! 🎉