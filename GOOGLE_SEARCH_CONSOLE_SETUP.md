# Google Search Console Setup - Quick Guide

## Step-by-Step Instructions

### 1. Sign in to Google Search Console
Visit: https://search.google.com/search-console

### 2. Add Your Property

**Option A: Domain Property (Recommended for multiple subdomains)**
```
Domain: yourdomain.com
Verification: DNS TXT record
```

**Option B: URL Prefix (Recommended for single site)**
```
URL: https://yourdomain.com
Verification: HTML tag or file
```

### 3. Verification Methods

#### Method 1: HTML Meta Tag (Easiest)
1. Copy the verification meta tag from Google Search Console
2. Open `client/index.html`
3. Uncomment line 44 and paste your code:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
   ```
4. Deploy your website
5. Click "Verify" in Google Search Console

#### Method 2: HTML File Upload
1. Download the verification file from Google Search Console
2. Place it in `client/public/` folder
3. Deploy your website
4. Click "Verify" in Google Search Console

#### Method 3: DNS Record (For Domain Property)
1. Log in to your domain registrar
2. Add the TXT record provided by Google
3. Wait for DNS propagation (can take up to 48 hours)
4. Click "Verify" in Google Search Console

### 4. Submit Your Sitemap

Once verified:
1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **Submit**

Your sitemap URL will be: `https://yourdomain.com/sitemap.xml`

### 5. Request Indexing for Important Pages

1. Click **URL Inspection** in the left sidebar
2. Enter a URL: `https://yourdomain.com`
3. Click **Request Indexing**

Repeat for:
- Homepage: `/`
- Articles page: `/articles`
- Calculators page: `/calculators`
- Categories page: `/categories`
- Your most important articles

**Note**: You can request indexing for about 10 URLs per day.

### 6. Monitor Your Website

After setup, check these sections regularly:

#### Performance
- Shows impressions, clicks, CTR, and position
- See what search queries bring users to your site
- Identify your best-performing pages

#### Coverage
- Shows which pages are indexed
- Lists any errors preventing indexing
- Shows excluded pages

#### Enhancements
- Mobile usability issues
- Core Web Vitals
- Breadcrumb errors
- Other structured data issues

#### Links
- Shows internal and external links
- Top linked pages
- Linking domains

### 7. Common Issues and Solutions

#### Issue: "Page not indexed"
**Solutions:**
- Request indexing via URL Inspection tool
- Check robots.txt (make sure page isn't blocked)
- Verify sitemap is submitted correctly
- Wait (can take 1-4 weeks for new sites)

#### Issue: "Crawled - currently not indexed"
**Solutions:**
- Improve content quality and uniqueness
- Add more internal links to the page
- Build external backlinks
- Increase page word count (aim for 500+ words)

#### Issue: "Sitemap could not be read"
**Solutions:**
- Verify sitemap URL is accessible in browser
- Check XML format is valid
- Ensure server returns correct content-type (application/xml)
- Check for CORS issues

#### Issue: "Mobile usability errors"
**Solutions:**
- Use responsive design (your site already does!)
- Test with Mobile-Friendly Test tool
- Check text isn't too small
- Ensure clickable elements aren't too close

### 8. Timeline Expectations

**Verification**: Immediate (after you complete steps)

**Sitemap Processing**: 1-3 days

**First Indexing**: 
- New site: 1-4 weeks
- Established site: 1-7 days

**Ranking Improvements**: 2-6 months (ongoing process)

### 9. Additional Tools to Use

**Google PageSpeed Insights**
- URL: https://pagespeed.web.dev/
- Checks: Loading speed, Core Web Vitals
- Goal: 90+ score on mobile and desktop

**Mobile-Friendly Test**
- URL: https://search.google.com/test/mobile-friendly
- Checks: Mobile responsiveness
- Goal: Pass all checks

**Rich Results Test**
- URL: https://search.google.com/test/rich-results
- Checks: Structured data (schema.org markup)
- Goal: Valid medical article schemas

**Schema Markup Validator**
- URL: https://validator.schema.org/
- Checks: JSON-LD structured data
- Goal: No errors

### 10. SEO Best Practices for Medical Content

**Content Quality:**
- ✅ Write accurate, well-researched articles
- ✅ Cite medical sources
- ✅ Update content regularly
- ✅ Use proper medical terminology
- ✅ Explain complex terms simply

**E-A-T (Expertise, Authoritativeness, Trustworthiness):**
- ✅ Show author credentials
- ✅ Link to authoritative medical sources
- ✅ Keep content updated
- ✅ Provide clear publication/update dates
- ✅ Have an "About" page
- ✅ Include contact information

**YMYL (Your Money Your Life):**
Medical content is YMYL, which means Google holds it to higher standards:
- ✅ Ensure accuracy
- ✅ Provide proper disclaimers
- ✅ Show medical expertise
- ✅ Link to credible sources
- ✅ Keep information current

### 11. Checklist Before Going Live

- [ ] Replace all `yourdomain.com` with your actual domain
- [ ] Add Google Search Console verification code
- [ ] Generate favicon files (16x16, 32x32, 180x180, 192x192, 512x512)
- [ ] Create og-image.jpg (1200x630px) for social sharing
- [ ] Set up HTTPS/SSL certificate
- [ ] Test robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Test sitemap.xml: `https://yourdomain.com/sitemap.xml`
- [ ] Deploy website
- [ ] Verify in Google Search Console
- [ ] Submit sitemap
- [ ] Request indexing for key pages
- [ ] Test Open Graph tags: https://developers.facebook.com/tools/debug/
- [ ] Test Twitter Cards: https://cards-dev.twitter.com/validator
- [ ] Run PageSpeed Insights test
- [ ] Run Mobile-Friendly test
- [ ] Check schema markup with Rich Results Test

### 12. Ongoing Maintenance

**Weekly:**
- Check Search Console for new errors
- Monitor indexing status
- Review search queries

**Monthly:**
- Analyze performance trends
- Update old content
- Add new articles
- Check for broken links
- Review Core Web Vitals

**Quarterly:**
- Review and update SEO strategy
- Analyze competitor performance
- Update meta descriptions
- Refresh outdated statistics/information

### 13. Getting Help

**Google Support:**
- Documentation: https://support.google.com/webmasters
- Community Forum: https://support.google.com/webmasters/community

**Testing Tools:**
- Search Console: https://search.google.com/search-console
- PageSpeed: https://pagespeed.web.dev/
- Mobile-Friendly: https://search.google.com/test/mobile-friendly
- Rich Results: https://search.google.com/test/rich-results

---

## Quick Reference: Your SEO Files

```
client/
├── index.html                       # Main SEO meta tags
├── public/
│   ├── robots.txt                   # Crawling rules
│   ├── site.webmanifest            # PWA manifest
│   ├── .htaccess                    # Apache config (if using Apache)
│   └── [verification-file].html    # Google verification (optional)
└── src/
    └── components/
        └── common/
            └── SEO.jsx              # Dynamic SEO component

server/
└── src/
    ├── routes/
    │   └── sitemap.js              # Sitemap route
    └── utils/
        └── sitemapGenerator.js     # Sitemap generator
```

**Note**: Your sitemap updates automatically when you add new articles!

---

**Remember**: SEO is a marathon, not a sprint. Quality content + good technical SEO + patience = success! 🚀

