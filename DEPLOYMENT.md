# MeroProfile Deployment Guide

This guide will help you deploy MeroProfile to production.

## Pre-Deployment Checklist

### 1. Supabase Configuration
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage bucket created and configured
- [ ] Authentication providers enabled
- [ ] RLS policies verified
- [ ] API keys noted

### 2. Project Configuration
- [ ] `config.js` updated with Supabase credentials
- [ ] Bank details updated (for featured plans)
- [ ] Logo and assets added
- [ ] SEO meta tags configured
- [ ] Social media links updated

### 3. Testing
- [ ] User registration works
- [ ] Login/logout works
- [ ] Profile creation works
- [ ] Image upload works
- [ ] Search functionality works
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified

## Deployment Options

### Option 1: Netlify (Recommended)

#### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Click "Deploy site"

#### Step 3: Configure Custom Domain (Optional)
1. Go to Domain settings
2. Add custom domain
3. Configure DNS records

#### Step 4: Update Supabase Redirect URLs
1. Go to Supabase Authentication settings
2. Add your Netlify URL to redirect URLs:
   - `https://your-site.netlify.app`
   - `https://your-custom-domain.com` (if applicable)

### Option 2: Vercel

#### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Click "Deploy"

#### Step 3: Update Supabase Redirect URLs
1. Go to Supabase Authentication settings
2. Add your Vercel URL to redirect URLs:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if applicable)

### Option 3: GitHub Pages

#### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select source: main branch
4. Click Save

#### Step 3: Update Supabase Redirect URLs
1. Go to Supabase Authentication settings
2. Add your GitHub Pages URL:
   - `https://username.github.io/repository-name`

### Option 4: Traditional Web Hosting

#### Step 1: Prepare Files
1. Download all project files
2. Ensure `config.js` is properly configured

#### Step 2: Upload via FTP
1. Connect to your hosting via FTP
2. Upload all files to public_html or www directory
3. Ensure file permissions are correct (644 for files, 755 for directories)

#### Step 3: Update Supabase Redirect URLs
1. Go to Supabase Authentication settings
2. Add your domain URL:
   - `https://your-domain.com`

## Post-Deployment Configuration

### 1. Test All Features
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Login works
- [ ] Profile creation works
- [ ] Image uploads work
- [ ] Search works
- [ ] All links work

### 2. Configure SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Open Graph tags
- [ ] Test social media sharing
- [ ] Check page load speed

### 3. Set Up Monitoring
- [ ] Configure error tracking (optional)
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Monitor Supabase usage

### 4. Security Checklist
- [ ] HTTPS enabled
- [ ] Supabase RLS policies active
- [ ] API keys not exposed in client code
- [ ] CORS configured correctly

## Environment-Specific Configuration

### Development
```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_DEV_SUPABASE_URL',
    anonKey: 'YOUR_DEV_SUPABASE_ANON_KEY'
};
```

### Production
```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_PROD_SUPABASE_URL',
    anonKey: 'YOUR_PROD_SUPABASE_ANON_KEY'
};
```

## Troubleshooting

### Images Not Loading
- Check storage bucket is public
- Verify CORS settings in Supabase
- Check file paths are correct

### Authentication Not Working
- Verify redirect URLs in Supabase
- Check API keys are correct
- Ensure HTTPS is enabled

### Database Errors
- Check RLS policies are enabled
- Verify schema is up to date
- Check user permissions

## Maintenance

### Regular Tasks
- Monitor Supabase usage
- Review and moderate user content
- Approve featured plan requests
- Update categories and cities as needed
- Backup database regularly

### Updates
- Keep Supabase client library updated
- Monitor for security updates
- Test new features before deploying

## Support

For deployment issues:
1. Check browser console for errors
2. Review Supabase logs
3. Verify all configuration settings
4. Test in incognito mode

## Rollback Procedure

If deployment fails:
1. Revert to previous Git commit
2. Redeploy previous version
3. Check Supabase configuration
4. Review error logs

---

Good luck with your deployment! 🚀