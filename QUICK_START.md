# MeroProfile - Quick Start Guide

Get MeroProfile running in 10 minutes!

## 🚀 Super Quick Setup

### Step 1: Get Supabase Credentials (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project → Wait 2 minutes
3. Go to **SQL Editor** → Copy `supabase-schema.sql` → Run
4. Go to **Storage** → Create bucket "MeroProfile" → Make it public
5. Go to **Settings** → **API** → Copy URL and anon key

### Step 2: Configure Project (2 minutes)

1. Open `config.js`
2. Replace:
```javascript
url: 'YOUR_SUPABASE_URL',      // Paste your URL
anonKey: 'YOUR_SUPABASE_ANON_KEY'  // Paste your key
```
3. Save file

### Step 3: Run Locally (1 minute)

```bash
python -m http.server 8000
```

Open: `http://localhost:8000`

### Step 4: Test (2 minutes)

1. Click "Sign Up" → Create account
2. Click "Create Profile" → Fill form → Submit
3. Search for your profile

**Done! 🎉**

## 📦 Deploy to Netlify (5 minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Go to netlify.com → New site from Git
# 3. Select repo → Deploy
# 4. Update Supabase redirect URLs with your Netlify URL
```

## 🆘 Common Issues

**Images not uploading?**
→ Check storage bucket is public

**Can't login?**
→ Verify Supabase URL and key in config.js

**Database error?**
→ Make sure schema was executed

## 📚 Full Documentation

- **Setup**: See `SETUP_INSTRUCTIONS.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Features**: See `README.md`

## 🎯 What's Included

✅ User authentication
✅ Business profiles
✅ Professional profiles
✅ Search & filtering
✅ Image uploads
✅ Featured profiles
✅ Responsive design
✅ SEO optimized

## 🔜 What's Next

After basic setup:
1. Add your logo (`assets/images/MeroProfile-Logo.png`)
2. Customize colors in `css/styles.css`
3. Update categories in `config.js`
4. Create test profiles
5. Deploy to production

## 💡 Pro Tips

- Test everything locally first
- Use real images for better UX
- Create sample profiles for demo
- Monitor Supabase usage
- Keep documentation handy

---

Need help? Check `README.md` for detailed docs!