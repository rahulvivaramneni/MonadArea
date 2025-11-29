# MonadArena - Next.js

A production-ready Next.js application for hackathon prediction and staking platform.

## Features

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS v4** for styling
- 📱 **Responsive Design** with mobile-first approach
- 🔥 **TypeScript** for type safety
- 🎯 **SEO Optimized** with metadata and Open Graph tags
- 🌙 **Dark Mode** support with next-themes
- 🚀 **Production Ready** with optimized builds

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/        # React components
│   │   ├── ui/           # UI component library
│   │   └── ...           # Feature components
│   ├── types/            # TypeScript type definitions
│   └── styles/          # Additional styles
├── public/               # Static assets
└── ...config files
```

## Build for Production

```bash
npm run build
npm start
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Chart library
- **next-themes** - Theme management

## Migration Notes

This project was migrated from Vite + React to Next.js. Key changes:

- ✅ Converted to App Router structure
- ✅ Updated all imports to remove version tags
- ✅ Migrated images to `next/image`
- ✅ Added "use client" directives where needed
- ✅ Updated styling with `next/font`
- ✅ Fixed TypeScript types for charts and components
- ✅ Added SEO metadata and favicon

## License

Private project
