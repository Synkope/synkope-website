# Content Maintenance Guide

Quick reference for maintaining the Synkope website service pages content system.

## 📁 File Structure

```
synkope-website/
├── content/
│   └── no.json                    # 🎯 MAIN CONTENT FILE
├── tjenester/
│   ├── ikt-infrastruktur.html     # Service page templates
│   ├── prosjektstyring.html
│   ├── informasjonssikkerhet.html
│   └── emc.html
├── js/
│   └── service-content-loader.js  # Dynamic loading system
└── test-service-content.html      # Testing tool
```

## 🔧 Common Tasks

### ✏️ Update Service Content

**Edit:** `content/no.json` → `service_pages` → `[service_name]` → `content`

```json
{
  "service_pages": {
    "prosjektstyring": {
      "content": {
        "intro": [
          "First paragraph...",
          "Second paragraph..."
        ],
        "service_areas": [
          "First service area",
          "Second service area"
        ]
      }
    }
  }
}
```

### 📝 Update Meta Information

**Edit:** `content/no.json` → `service_pages` → `[service_name]`

```json
{
  "service_pages": {
    "prosjektstyring": {
      "title": "New Page Title",
      "meta_description": "New SEO description for search engines"
    }
  }
}
```

### 📞 Update Contact Information

**Edit:** `content/no.json` → `footer` → `contact_info`

```json
{
  "footer": {
    "contact_info": {
      "company": "Synkope AS",
      "address": "New Address",
      "postal": "1234 City",
      "org_number": "Org. nr. 123 456 789",
      "email": "new@synkope.io"
    }
  }
}
```

## ➕ Adding New Service Page

### Step 1: Create HTML Template

Create `tjenester/new-service.html` using existing template:

```html
<!doctype html>
<html lang="no">
<head>
  <meta charset="UTF-8" />
  <title>New Service - Synkope</title>
  <meta name="description" content="Service description" />
  <meta name="use-content-loader" content="true" />
  <!-- ... existing head content ... -->
</head>
<body>
  <!-- ... navigation ... -->
  
  <section class="service-hero">
    <div class="container">
      <div class="service-hero-content">
        <h1>Service Title</h1>
      </div>
    </div>
  </section>

  <section class="service-content">
    <div class="container">
      <div class="service-content">
        <div class="service-main">
          <div class="service-section">
            <p>Laster innhold...</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ... footer ... -->
  
  <script src="../js/service-content-loader.js"></script>
  <script src="../js/script.js"></script>
</body>
</html>
```

### Step 2: Add Content to JSON

Add to `content/no.json` → `service_pages`:

```json
{
  "service_pages": {
    "new_service": {
      "title": "New Service",
      "meta_description": "Description for SEO",
      "content": {
        "intro": [
          "Introduction paragraph 1",
          "Introduction paragraph 2"
        ],
        "competencies": [
          "First competency",
          "Second competency"
        ]
      }
    }
  }
}
```

### Step 3: Update Content Loader (if needed)

If filename doesn't follow pattern, update `js/service-content-loader.js`:

```javascript
const serviceMap = {
  "ikt-infrastruktur": "ikt_infrastruktur",
  "prosjektstyring": "prosjektstyring",
  "informasjonssikkerhet": "informasjonssikkerhet",
  "emc": "emc",
  "new-service": "new_service"  // Add this line
};
```

## 🧪 Testing Changes

### Method 1: Test Page
1. Open `test-service-content.html` in browser
2. Use service buttons to test different pages
3. Check debug information and content preview

### Method 2: Direct Testing
1. Open actual service page: `tjenester/service-name.html`
2. Check browser console for errors (F12)
3. Verify content loads correctly

### Method 3: Command Line Check
```bash
# Verify JSON syntax
python3 -c "import json; json.load(open('content/no.json'))"

# Test content loading
node -e "console.log(JSON.parse(require('fs').readFileSync('content/no.json')).service_pages)"
```

## 🎨 Content Types Guide

### Standard Elements

**Intro paragraphs:**
```json
"intro": [
  "First paragraph text",
  "Second paragraph text"
]
```

**Bulleted lists:**
```json
"competencies": [
  "Item 1",
  "Item 2"
]
```

**Service areas:**
```json
"service_areas": [
  "Area 1",
  "Area 2"
]
```

### Advanced Elements

**Multi-section content (like informasjonssikkerhet):**
```json
"content": {
  "intro": ["..."],
  "key_competencies": ["..."],
  "standards": "Text paragraph",
  "sections": {
    "compliance": {
      "title": "Section Title",
      "intro": ["Section intro..."],
      "services": ["Service 1", "Service 2"]
    }
  }
}
```

## 🚨 Troubleshooting

### Content Not Loading
- **Check browser console** (F12) for JavaScript errors
- **Verify JSON syntax** - one invalid comma breaks everything
- **Check file paths** - ensure `../content/no.json` is accessible
- **Test with**: `test-service-content.html`

### Content Shows "Laster innhold..."
- **Service not detected** - check URL pattern and `serviceMap`
- **JSON parsing error** - validate JSON syntax
- **Network error** - check if `content/no.json` is accessible

### Missing/Wrong Content
- **Check service name mapping** in `js/service-content-loader.js`
- **Verify JSON structure** matches expected format
- **Test specific service** with test page

### SEO Issues
- **Meta tags not updating** - check `meta_description` in JSON
- **Title not changing** - verify `title` field in service data
- **Check network tab** in browser dev tools for loading issues

## 📋 Maintenance Checklist

### Before Making Changes
- [ ] Backup current `content/no.json`
- [ ] Test current site functionality
- [ ] Note what you're changing

### After Making Changes
- [ ] Validate JSON syntax
- [ ] Test with `test-service-content.html`
- [ ] Check actual service pages
- [ ] Verify browser console for errors
- [ ] Test on mobile/different browsers

### Weekly Checks
- [ ] All service pages load correctly
- [ ] Contact information is current
- [ ] No JavaScript console errors
- [ ] Test page functionality works

## 🔗 Quick Links

- **Main content file**: `content/no.json`
- **Content loader**: `js/service-content-loader.js`
- **Test page**: `test-service-content.html`
- **Service templates**: `tjenester/*.html`

## 📞 Need Help?

1. **Check the console** (F12 in browser)
2. **Use the test page** to isolate issues
3. **Validate JSON** syntax online if needed
4. **Refer to existing working examples** in the JSON file

---

*Last updated: 2025-01-27*