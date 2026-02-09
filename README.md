# GWK Structural Solutions Ltd Website

A modern, professional website for GWK Structural Solutions Ltd, built with Next.js and Tailwind CSS.

## About GWK Structural Solutions

GWK Structural Solutions provides the highest quality design solutions for a wide variety of projects ranging from small domestic extensions to new multi-million pound new build and refurbishment projects.

Established in 2006, we offer a wide range of Structural and Civil Engineering services across all sectors of the construction industry and property market.

## Features

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** with professional theme
- 🔷 **TypeScript** for type safety
- 📱 **Responsive design** for all devices

## Website Structure

- **Home** - Company introduction and contact information
- **About** - Company history and philosophy
- **Services** - Structural engineering services offered
- **Contact** - Contact details and address

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Both Servers

**Terminal 1 - Next.js Website (Port 3000):**
```bash
npm run dev
```

**Terminal 2 - Sanity Studio (Port 3333):**
```bash
npm run dev:studio
```

Now you have:
- **Website:** http://localhost:3000
- **Sanity Studio:** http://localhost:3333

### Build for Production

```bash
npm run build
npm start
```

## Adding Sanity CMS (Optional)

To integrate Sanity CMS for content management, you can set up a separate Sanity Studio:

### Setup Sanity Studio

1. Install Sanity CLI globally:
```bash
npm install -g @sanity/cli
```

2. Initialize Sanity in a separate directory or subdirectory:
```bash
sanity init
```

3. Use your existing project ID: **ddua7oi6**

4. Run Sanity Studio separately:
```bash
cd studio  # or your studio directory
sanity start
```

This will run the Sanity Studio on port 3333.

### Connect Next.js to Sanity

When ready to fetch content from Sanity:

1. Install Sanity client:
```bash
npm install next-sanity @sanity/image-url
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ddua7oi6
NEXT_PUBLIC_SANITY_DATASET=production
```

3. Add Sanity client in `src/lib/sanity.ts`

## Customizing the Theme

The Tailwind theme uses a professional blue color scheme suitable for structural engineering. You can customize it in [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  primary: {
    500: "#3b82f6", // Professional blue
    // ... other shades
  },
}
```

## Contact Information

**Gareth Kimber**  
37 Anglesey drive  
Poynton  
Cheshire  
SK12 1BU

Email: gareth@gwkss.co.uk  
Mobile: 07971 246 333

## Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
