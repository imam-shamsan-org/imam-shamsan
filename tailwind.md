Here is the Tailwind CSS configuration and a global CSS strategy to ensure your Arabic and English typography looks balanced and professional.

### 1. Tailwind Configuration

Add this to your `tailwind.config.js`. It defines a specific font stack for Arabic that pairs well with modern English sans-serifs.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // 'Inter' for English, 'IBM Plex Sans Arabic' for Arabic
        sans: ['Inter', 'IBM Plex Sans Arabic', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 2. Global CSS Strategy

Add this to your main `index.css`. This uses the `unicode-range` concept (implicitly via font-family ordering) and logical properties to handle the layout.

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');

/* Base Body Styles */
body {
  @apply font-sans antialiased text-gray-900;
  text-rendering: optimizeLegibility;
}

/* Logical Properties helper */
/* Using 'ms' (margin-start) instead of 'ml' (margin-left) 
   allows the browser to flip spacing automatically when dir="rtl" is detected */
.post-content {
  @apply leading-relaxed;
}

/* Specific Arabic tuning */
[dir='rtl'] {
  @apply font-arabic;
  line-height: 1.8; /* Arabic characters need more vertical space */
  letter-spacing: 0; /* Letter spacing usually breaks Arabic script connectivity */
}

/* Handle punctuation at the end of sentences in RTL */
[dir='rtl'] p {
  unicode-bidi: plaintext;
  text-align: right;
}
```

### 3. Usage in your Block Component

Since you aren't selecting a language manually, your component handles the "flip" on the fly:

```tsx
const NotionBlock = ({ text }) => {
  const isRtl = /[\u0600-\u06FF]/.test(text)

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`mb-4 ${isRtl ? 'text-right' : 'text-left'}`}
    >
      <p className="text-lg md:text-xl">{text}</p>
    </div>
  )
}
```

### Why this works:

1. **Logical Properties:** By using Tailwind's `ps` (padding-start) or `ms` (margin-start) instead of `pl` or `ml`, your spacing will automatically shift to the correct side when the `dir` attribute changes.
2. **Line Height:** Arabic script is naturally taller than Latin. Setting a higher `line-height` for `[dir="rtl"]` prevents "clipped" characters.
3. **Font Ordering:** In the `sans` stack, the browser will try to find characters in **Inter** first. Since Inter doesn't have Arabic glyphs, it will automatically fall back to **IBM Plex Sans Arabic** for those specific words.
