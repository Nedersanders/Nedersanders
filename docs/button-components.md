# Button Components Documentation

This document describes the semantic CSS button components created using Tailwind CSS's `@apply` directive. The components are based on the Figma design system and provide a consistent, accessible button system.

## Overview

The button system includes:

- **CSS Variables** for color management and theming
- **Semantic class names** following BEM-like conventions
- **Nested structure** using CSS nesting for maintainability
- **Responsive design** with mobile-first approach
- **Dark mode support** through CSS custom properties
- **Accessibility features** including focus states and keyboard navigation

## CSS Variables

The system uses CSS custom properties for consistent color management:

```css
:root {
  /* Primary Colors */
  --color-primary-default: #2C71F6;
  --color-primary-hover: #2257BE;
  --color-primary-disabled: #BBD1FC;
  
  /* Secondary Colors */
  --color-secondary-border: #D8D8DA;
  --color-secondary-hover: #F8F9FB;
  
  /* Text Colors */
  --color-text-primary: #202020;
  --color-text-inverse: #FFFFFF;
  --color-text-disabled: #BBD1FC;
}
```

## Base Button Class

All buttons start with the base `.btn` class:

```html
<button class="btn">Base Button</button>
```

## Button Types

### Primary Buttons
For primary actions and main CTAs:

```html
<button class="btn btn-primary">Primary Button</button>
```

### Secondary Buttons
For secondary actions:

```html
<button class="btn btn-secondary">Secondary Button</button>
```

### Text Buttons
For tertiary actions and links:

```html
<button class="btn btn-text">Text Button</button>
```

## Button Sizes

Five size options available:

- `.btn-xs` - Extra Small (34px height)
- `.btn-sm` - Small (36px height)
- `.btn-md` - Medium (38px height)
- `.btn-lg` - Large (48px height)
- `.btn-xl` - Extra Large (52px height)

```html
<button class="btn btn-primary btn-xs">Extra Small</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-md">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

## Button States

### Disabled State
Add the `disabled` attribute:

```html
<button class="btn btn-primary btn-md" disabled>Disabled Button</button>
```

### Loading State
Add `.btn-loading` class:

```html
<button class="btn btn-primary btn-md btn-loading">Loading...</button>
```

### Focus State
Automatically handled via CSS `:focus` pseudo-class with proper focus rings.

## Icons

### Buttons with Icons
Add `.btn-icon` class and specify position:

```html
<!-- Icon before text -->
<button class="btn btn-primary btn-md btn-icon btn-icon-prefix">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="..."></path>
  </svg>
  Edit
</button>

<!-- Icon after text -->
<button class="btn btn-primary btn-md btn-icon btn-icon-suffix">
  Save
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="..."></path>
  </svg>
</button>
```

### Icon-Only Buttons
Use `.btn-icon-only` for square buttons:

```html
<button class="btn btn-primary btn-md btn-icon-only">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="..."></path>
  </svg>
</button>
```

## Button Groups

Group related buttons together:

```html
<div class="btn-group">
  <button class="btn btn-secondary btn-md">Left</button>
  <button class="btn btn-secondary btn-md">Middle</button>
  <button class="btn btn-secondary btn-md">Right</button>
</div>
```

## Special Variants

### Block Button
Full-width button:

```html
<button class="btn btn-primary btn-md btn-block">Block Button</button>
```

### Rounded Button
Fully rounded button:

```html
<button class="btn btn-primary btn-md btn-rounded">Rounded</button>
```

### Gradient Button
Gradient background button:

```html
<button class="btn btn-gradient btn-md">Gradient</button>
```

## Dark Mode Support

The components automatically adapt to dark mode using `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-secondary-border: var(--color-dark-border);
    --color-secondary-hover: var(--color-dark-hover);
  }
}
```

## Customization

### Adding New Colors
Add new color variables and create modifier classes:

```css
:root {
  --color-success-default: #10B981;
  --color-success-hover: #059669;
}

.btn-success {
  background-color: var(--color-success-default);
  
  &:hover:not(:disabled) {
    background-color: var(--color-success-hover);
  }
}
```

### Custom Sizes
Add new size variants:

```css
.btn-2xl {
  @apply px-8 py-4 text-lg h-16;
}
```

## Accessibility

The button components include:

- **Focus indicators** with visible focus rings
- **Color contrast** meeting WCAG guidelines
- **Keyboard navigation** support
- **Screen reader** friendly markup
- **Disabled state** handling

## Browser Support

- Modern browsers supporting CSS custom properties
- CSS nesting (or using a preprocessor)
- Tailwind CSS v3+

## Best Practices

1. **Use semantic HTML** - Always use `<button>` for interactive buttons
2. **Provide context** - Use aria-labels for icon-only buttons
3. **Loading states** - Show feedback during async operations
4. **Consistent sizing** - Use standard sizes across your application
5. **Color meaning** - Use button types consistently (primary for main actions, secondary for alternatives)

## Examples

### Form Actions
```html
<div class="flex gap-4">
  <button type="submit" class="btn btn-primary btn-md">Save Changes</button>
  <button type="button" class="btn btn-secondary btn-md">Cancel</button>
</div>
```

### Navigation
```html
<div class="btn-group">
  <button class="btn btn-secondary btn-sm">Previous</button>
  <button class="btn btn-secondary btn-sm">1</button>
  <button class="btn btn-primary btn-sm">2</button>
  <button class="btn btn-secondary btn-sm">3</button>
  <button class="btn btn-secondary btn-sm">Next</button>
</div>
```

### Call-to-Action
```html
<button class="btn btn-primary btn-lg btn-icon btn-icon-suffix">
  Get Started
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
  </svg>
</button>
```
