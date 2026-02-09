# Sanity CMS Content Guide

Your website now uses Sanity CMS to manage all content. Here's how to add and manage your content:

## Getting Started

1. Start the Sanity Studio: `cd studio/studio && npm run dev`
2. Open http://localhost:3333 in your browser
3. Log in with your Sanity account

## Content Structure

You'll see **5 document types** in your studio. Each page has its own document with only the fields it needs:

### 📄 1. Home
Edit the homepage content:
- **Main Heading**: Your company name (e.g., "GWK Structural Solutions")
- **Tagline**: Main introduction text on the homepage

### 📄 2. About
Edit the About page:
- **About Content**: Rich text content for your About page with full formatting options (bold, italic, lists, etc.)

### 📄 3. Services
Edit the Services page:
- **Services Content**: Rich text content for your Services page with full formatting options (bold, italic, lists, etc.)

### 📄 4. Contact
Edit the Contact page:
- **Contact Content**: Rich text content for your Contact page with full formatting options (bold, italic, lists, etc.)

### ⚙️ 5. Site Settings
Global settings used across the website:
- **Company Name**: Used in footer and navigation
- **Contact Email**: Displayed in footer on all pages
- **Contact Phone**: Displayed in footer on all pages

---

## How to Add Content

### First Time Setup

Since these are **singleton documents** (only one of each allowed), you need to create each document once:

1. Click on **"Home"** in the sidebar
2. Click the **"+" icon** or **"Create"** button
3. Fill in the fields with your content
4. Click **"Publish"**

Repeat for each document type: **Home, About, Services, Contact, and Site Settings**.

### Editing Existing Content

Once created, editing is simple:

1. Click on the document name in the sidebar (e.g., "Home")
2. Edit any field
3. Click **"Publish"** to save changes
4. Your website updates **automatically**!

---

## Sample Content to Copy/Paste

### Site Settings
```
Company Name: GWK Structural Solutions Ltd
Contact Email: gareth@gwkss.co.uk
Contact Phone: 07971 246 333
```

### Home
```
Main Heading: GWK Structural Solutions

Tagline: provides the highest quality design solutions for a wide variety of projects ranging from small domestic extensions to new multi million pound new build and refurbishment projects.
```

### About
Click into the **About Content** field and paste this text (you can format it after):

```
Established in 2006 GWK Structural Solutions offers a wide range of Structural and Civil Engineering services across all sectors of the construction industry and property market. We are ideally placed to provide economic solutions for small domestic projects right up to major developments.

Our philosophy is based on developing a clear understanding of our clients brief in order to provide simple cost effective solutions that help them achieve their objectives and requirements.
```

### Services
Click into the **Services Content** field and paste this text (you can format it after):

```
GWK Structural Solutions specialise in the design and detailing of the following elements all of which are in accordance with the latest British Standards and Design Standards.

Our services include:
- Structural Steelwork
- Reinforced Concrete
- Masonry
- Timber

We also provide Structural Survey Reports and Dilapidation Surveys.

GWK Structural Solutions offer free no obligation fixed price quotations and are always happy to discuss your specific projects requirements.
```

### Contact
Click into the **Contact Content** field and paste this text (you can format it after):

```
Gareth Kimber
37 Anglesey drive
Poynton
Cheshire
SK12 1BU

Email: gareth@gwkss.co.uk
Phone: 07971 246 333
```

---

## Page Mapping

Here's what each Sanity document controls on your website:

| Sanity Document | Website Page | URL |
|----------------|-------------|-----|
| Home | Homepage | http://localhost:3000/ |
| About | About page | http://localhost:3000/about |
| Services | Services page | http://localhost:3000/services |
| Contact | Contact page | http://localhost:3000/contact |
| Site Settings | Footer (all pages) | All pages |

---

## Tips & Best Practices

✅ **Always click "Publish"** - Drafts don't appear on the website  
✅ **Test immediately** - Open your website after publishing to see changes  
✅ **Use rich text formatting** - The About content field supports bold, italic, lists  
✅ **Add services in order** - They'll appear in the order you add them to the Services List  

---

## Troubleshooting

### Content Not Showing on Website

**Problem:** I published content but it's not showing  
**Solution:**
- Make sure you clicked **"Publish"** (not just "Save as draft")
- Refresh your browser at http://localhost:3000
- Check both servers are running:
  - Next.js: `npm run dev` (port 3000)
  - Sanity Studio: `cd studio/studio && npm run dev` (port 3333)

### CORS Errors in Sanity Studio

**Problem:** Getting CORS errors when accessing the Studio  
**Solution:**
1. Go to https://www.sanity.io/manage/personal/project/ddua7oi6
2. Navigate to **API settings**
3. Add `http://localhost:3333` to **CORS Origins**
4. Save and refresh the Studio

### Can't See Document Types

**Problem:** Don't see Home, About, etc. in the sidebar  
**Solution:**
- Make sure you're in the correct project (ID: ddua7oi6)
- Check that the Sanity Studio shows "Studio for gwkss" or similar
- Try refreshing the Studio browser window

---

## Advanced: Rich Text Formatting

When editing the **About Content** field, you can:

- **Bold text**: Select text and click B
- **Italic text**: Select text and click I  
- **Add paragraphs**: Just press Enter
- **Add bullet lists**: Click the list icon
- **Add numbered lists**: Click the numbered list icon

The content will maintain all formatting on your website automatically!
