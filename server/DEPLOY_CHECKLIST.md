# ✅ Backend Deployment Checklist

## Before Deploying to Render

### 1. Environment Variables Ready
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `JWT_SECRET`
- [ ] `JWT_EXPIRE`
- [ ] `CLIENT_URL` (will update after frontend deployment)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`

### 2. Code Quality
- [ ] All routes work locally
- [ ] Database connection works
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Error handling in place

### 3. Test Locally
```bash
npm install
npm start
```
- [ ] Server starts without errors
- [ ] Health check works: http://localhost:5000/api/health
- [ ] Test all API endpoints

### 4. Files to Check
- [ ] `package.json` has correct start script
- [ ] `.gitignore` includes `.env`
- [ ] `render.yaml` exists (optional)
- [ ] All dependencies in `package.json`

### 5. Git Repository
```bash
git status
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Render Deployment Steps

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository

3. **Configure Service**
   ```
   Name: portfolio-backend
   Region: Choose closest
   Branch: main
   Root Directory: server (if needed)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=https://chrlbaoeplqbsdvllsvn.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=dgncjhnxdfvdx123
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Copy your backend URL

## After Deployment

- [ ] Visit health endpoint: `https://your-backend.onrender.com/api/health`
- [ ] Test API endpoints with Postman
- [ ] Check logs for errors
- [ ] Update frontend with backend URL

## Update Frontend

Add your Render URL to frontend `.env.production`:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Update CORS

After frontend is deployed, update `CLIENT_URL` in Render:
```
CLIENT_URL=https://your-portfolio.vercel.app
```

---

**Your Render URL:** _________________
**Deployed Date:** _________________
