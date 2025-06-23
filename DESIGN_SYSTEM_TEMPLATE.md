# Design System Template - New World Software

This template provides a complete design system based on the AI Content Detector application, ensuring consistency across all future projects.

## 🎨 Color Palette

### Primary Colors
```css
primary: {
  50: '#eff6ff',   /* Very light blue */
  100: '#dbeafe',  /* Light blue */
  200: '#bfdbfe',  /* Lighter blue */
  300: '#93c5fd',  /* Light blue */
  400: '#60a5fa',  /* Medium light blue */
  500: '#3b82f6',  /* Primary blue */
  600: '#2563eb',  /* Medium blue */
  700: '#1d4ed8',  /* Dark blue */
  800: '#1e40af',  /* Darker blue */
  900: '#1e3a8a',  /* Darkest blue */
}
```

### Status Colors
```css
success: {
  500: '#22c55e',  /* Green */
  600: '#16a34a',
  700: '#15803d',
}

warning: {
  500: '#f59e0b',  /* Amber */
  600: '#d97706',
  700: '#b45309',
}

error: {
  500: '#ef4444',  /* Red */
  600: '#dc2626',
  700: '#b91c1c',
}
```

### Neutral Colors
```css
gray: {
  50: '#f9fafb',   /* Background light */
  100: '#f3f4f6',  /* Card background light */
  200: '#e5e7eb',  /* Border light */
  300: '#d1d5db',  /* Border */
  400: '#9ca3af',  /* Text muted */
  500: '#6b7280',  /* Text secondary */
  600: '#4b5563',  /* Text primary light */
  700: '#374151',  /* Text primary */
  800: '#1f2937',  /* Background dark */
  900: '#111827',  /* Background darkest */
}
```

## 📝 Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Typography Scale
```css
/* Headings */
h1: text-3xl (30px) font-bold leading-tight
h2: text-2xl (24px) font-bold leading-tight
h3: text-xl (20px) font-bold leading-tight

/* Body Text */
body: text-base (16px) leading-relaxed (1.625)
small: text-sm (14px)
tiny: text-xs (12px)

/* Display Text */
display: text-4xl-5xl (36-48px) font-bold
```

## 🎯 Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  @apply px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Secondary Button */
.btn-secondary {
  @apply px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200;
}

/* Icon Button */
.btn-icon {
  @apply p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200;
}
```

### Cards
```css
.card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200;
}

.card-hover {
  @apply card hover:shadow-xl hover:scale-[1.02] cursor-pointer;
}
```

### Form Elements
```css
.input {
  @apply px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200;
}

.input-error {
  @apply input border-red-500 focus:ring-red-500;
}
```

## 🌙 Dark Mode Implementation

### CSS Classes
```css
/* Light mode (default) */
body {
  @apply bg-gray-50 text-gray-900;
}

/* Dark mode */
.dark body {
  @apply bg-gray-900 text-gray-100;
}

/* Component dark mode variants */
.card {
  @apply bg-white dark:bg-gray-800;
}

.text-primary {
  @apply text-gray-900 dark:text-gray-100;
}

.text-secondary {
  @apply text-gray-600 dark:text-gray-400;
}

.border-default {
  @apply border-gray-200 dark:border-gray-700;
}
```

### Toggle Implementation
```typescript
const [isDarkMode, setIsDarkMode] = useState(true)

const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode)
}

// Apply to root element
<div className={isDarkMode ? 'dark' : ''}>
```

## 📐 Spacing System

### Base Unit: 4px (0.25rem)
```css
/* Spacing Scale */
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### Layout Spacing
- **Component padding**: p-6 (24px) or p-8 (32px)
- **Section spacing**: space-y-8 (32px)
- **Element spacing**: space-y-4 (16px) or space-y-6 (24px)
- **Container padding**: px-4 (16px)

## 🎭 Animation & Transitions

### Standard Transitions
```css
.transition-default {
  @apply transition-all duration-200 ease-in-out;
}

.transition-colors {
  @apply transition-colors duration-200;
}

.transition-transform {
  @apply transition-transform duration-200;
}
```

### Custom Animations
```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { 
    transform: translateY(10px);
    opacity: 0;
  }
  100% { 
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-in-out;
}
```

## 🏗️ Layout Patterns

### Container
```css
.container {
  @apply max-w-7xl mx-auto px-4;
}

.container-narrow {
  @apply max-w-4xl mx-auto px-4;
}

.container-content {
  @apply max-w-2xl mx-auto px-4;
}
```

### Grid Systems
```css
/* Two column responsive */
.grid-2-col {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

/* Three column responsive */
.grid-3-col {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Auto-fit grid */
.grid-auto {
  @apply grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6;
}
```

### Flexbox Patterns
```css
.flex-center {
  @apply flex items-center justify-center;
}

.flex-between {
  @apply flex items-center justify-between;
}

.flex-col-center {
  @apply flex flex-col items-center justify-center;
}
```

## 🎨 Visual Effects

### Shadows
```css
.shadow-soft {
  @apply shadow-lg;
}

.shadow-strong {
  @apply shadow-xl;
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### Gradients
```css
.gradient-primary {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
}

.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.gradient-bg {
  @apply bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20;
}
```

### Backdrop Effects
```css
.backdrop-glass {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-md;
}

.backdrop-card {
  @apply bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm;
}
```

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Patterns
```css
/* Mobile-first approach */
.responsive-text {
  @apply text-lg md:text-xl lg:text-2xl;
}

.responsive-padding {
  @apply p-4 md:p-6 lg:p-8;
}

.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
```

## 🎯 Component Library Structure

### File Organization
```
src/
├── components/
│   ├── ui/           # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/       # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── features/     # Feature-specific components
├── styles/
│   ├── globals.css   # Global styles
│   ├── components.css # Component styles
│   └── utilities.css # Utility classes
├── utils/
│   ├── cn.ts        # Class name utility
│   └── theme.ts     # Theme utilities
└── types/
    └── index.ts     # Type definitions
```

## 🛠️ Implementation Guide

### 1. Setup Tailwind Config
```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Add color palette here
      },
      animation: {
        // Add custom animations
      },
    },
  },
  plugins: [],
}
```

### 2. Base CSS Setup
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', sans-serif;
    @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200;
  }
}

@layer components {
  /* Component styles here */
}
```

### 3. Google Fonts Integration
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 🎨 Brand Guidelines

### Logo Usage
- Use magnifying glass icon for analysis/detection features
- Combine with clean, modern typography
- Maintain consistent spacing and proportions

### Voice & Tone
- **Professional**: Technical accuracy and reliability
- **Approachable**: User-friendly explanations
- **Confident**: Clear, decisive language
- **Helpful**: Actionable insights and recommendations

### Iconography
- Use Lucide React for consistent icon library
- Prefer outline style icons
- Standard sizes: 16px, 20px, 24px
- Colors: Match text color or use accent colors

## 📋 Checklist for New Projects

### Setup
- [ ] Install Tailwind CSS with dark mode support
- [ ] Add Inter font from Google Fonts
- [ ] Configure color palette and custom classes
- [ ] Set up component library structure
- [ ] Implement dark mode toggle

### Components
- [ ] Create base Button component with variants
- [ ] Build Card component with hover effects
- [ ] Implement Input components with validation states
- [ ] Add Loading/Spinner components
- [ ] Create Modal/Dialog components

### Layout
- [ ] Build responsive Header with navigation
- [ ] Create Footer with copyright auto-update
- [ ] Implement Container components
- [ ] Add responsive grid systems

### Features
- [ ] File upload with drag & drop
- [ ] Progress indicators and loading states
- [ ] Result displays with visual feedback
- [ ] History/timeline components
- [ ] Error handling and validation

This design system ensures consistency, maintainability, and professional appearance across all New World Software applications.