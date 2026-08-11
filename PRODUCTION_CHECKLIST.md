# Production Deployment Checklist

## Pre-Deployment
- [ ] All environment variables set in Vercel dashboard
- [ ] Database migrations run against production database
- [ ] Prisma client generated for production
- [ ] SSL/TLS configured for custom domain
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Email service verified (Resend domain verified)
- [ ] Cloudinary upload preset configured
- [ ] Error monitoring set up (Sentry recommended)
- [ ] Analytics configured (Vercel Analytics)

## Security Verification
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Auth secret is at least 32 characters
- [ ] Database password is strong
- [ ] API keys are restricted
- [ ] CORS is properly configured
- [ ] CSRF protection enabled (Auth.js handles this)

## Performance Verification
- [ ] Lighthouse score > 90
- [ ] Images are optimized
- [ ] Bundle size is acceptable (< 200KB initial load)
- [ ] API routes respond within 200ms
- [ ] Database queries are optimized

## Post-Deployment
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test email delivery
- [ ] Test file uploads
- [ ] Test admin functionality
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Monitor error logs for 24 hours

## Rollback Plan
- [ ] Previous deployment version noted
- [ ] Database backup available
- [ ] Quick rollback procedure documented