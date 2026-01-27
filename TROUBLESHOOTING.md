# Troubleshooting Guide - School Apps

## Problem: API Error - ERR_NAME_NOT_RESOLVED (api.school.com)

### Symptoms
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
api.school.com/v1/absensi/riwayat?tanggal_awal=...
```

### Root Cause
Frontend menggunakan URL yang salah untuk API karena environment variable configuration conflict.

### Files Affected
- `.env` - Base configuration
- `.env.local` - Local override (priority tinggi)

### Solution Applied

#### 1. Identify Environment File Priority
In Vite, environment files priority:
1. `.env.local` (highest priority) 
2. `.env.development.local`
3. `.env.development`
4. `.env.local`
5. `.env`

#### 2. Fix .env.local Configuration
```bash
# Before (incorrect)
VITE_API_BASE_URL=https://api.school.com/v1
VITE_ENABLE_MOCK_API=true

# After (correct)  
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_API=false
```

#### 3. Restart Development Server
```bash
# Kill vite process and restart
pkill -f "vite"
npm run dev
```

#### 4. Verify Backend Connection
```bash
# Test backend server
curl -X GET "http://localhost:3000/api/config" -H "Content-Type: application/json"

# Expected response:
{
  "success": true,
  "data": {
    "jam_mulai": "06:00:00",
    "jam_batas": "07:15:00",
    "latitude": "-6.2746848",
    "longitude": "106.9622814",
    "radius_meters": "60000"
  }
}
```

### Prevention
1. Always check `.env.local` when API URLs are wrong
2. Use environment-specific configs properly
3. Document environment setup in README

### Debug Steps Added
Added logging in `src/services/api.ts`:
```typescript
console.log('🔗 API Base URL:', API_BASE_URL)
console.log('🌍 Environment:', import.meta.env.MODE)
console.log('📋 All Vite Env:', import.meta.env)
```

### Verification Checklist
- ✅ `.env.local` points to `http://localhost:3000/api`
- ✅ Backend server running on port 3000
- ✅ Frontend dev server restarted
- ✅ Browser cache cleared (hard refresh)
- ✅ Console shows correct API URL

### Related Files Updated
- `.env.local` - Fixed API URL
- `src/services/api.ts` - Added debug logging

---

## Common Environment Variable Issues

### Issue: Wrong API URL
**Symptom**: `ERR_NAME_NOT_RESOLVED` or connection refused
**Solution**: Check `.env.local` overrides

### Issue: CORS Errors  
**Symptom**: `blocked by CORS policy`
**Solution**: Verify backend CORS settings and API URL

### Issue: 401 Unauthorized
**Symptom**: `Token tidak valid atau sudah kadaluarsa`
**Solution**: Login first to get valid JWT token

### Issue: Development Server Port Conflicts
**Symptom**: Port already in use
**Solution**: Kill processes or use different ports
```bash
lsof -i :5173  # Check what's using port
pkill -f "vite"  # Kill vite processes
```

---

## Quick Fix Commands

```bash
# Reset environment and restart
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env.local
pkill -f "vite"
npm run dev

# Verify backend
curl http://localhost:3000/api/config

# Check ports
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
```

**Status: RESOLVED ✅**
