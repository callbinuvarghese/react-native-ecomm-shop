# Using Theme Provider in the Shop App

This app uses `@react-navigation/native`'s `ThemeProvider` which automatically switches between light and dark modes based on the device's system settings.

## How It Works

The theme provider is set up in [app/_layout.tsx](app/_layout.tsx):

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Using Theme in Components

### 1. Import the useTheme hook

```tsx
import { useTheme } from '@react-navigation/native';
```

### 2. Get the theme object in your component

```tsx
export default function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello World</Text>
    </View>
  );
}
```

## Available Theme Colors

The theme object provides these colors:

- `theme.colors.primary` - Primary brand color
- `theme.colors.background` - Background color for screens
- `theme.colors.card` - Background color for cards/surfaces
- `theme.colors.text` - Primary text color
- `theme.colors.border` - Border color
- `theme.colors.notification` - Color for notifications/badges

### Example Color Values

**Light Mode (DefaultTheme):**
- `background`: '#f6f6f6'
- `card`: '#ffffff'
- `text`: '#000000'
- `border`: '#d0d0d0'
- `primary`: '#007AFF'

**Dark Mode (DarkTheme):**
- `background`: '#000000'
- `card`: '#1c1c1e'
- `text`: '#ffffff'
- `border`: '#272729'
- `primary`: '#0A84FF'

## Best Practices

### ✅ DO: Use theme colors for backgrounds and text

```tsx
<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
  <Text style={[styles.title, { color: theme.colors.text }]}>
    My Title
  </Text>
</View>
```

### ✅ DO: Combine static styles with dynamic theme colors

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // Don't hardcode backgroundColor here
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // Don't hardcode color here
  },
});

// Then in your component:
<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
  <Text style={[styles.title, { color: theme.colors.text }]}>Title</Text>
</View>
```

### ❌ DON'T: Hardcode colors that should change with theme

```tsx
// Bad - this will look wrong in dark mode
<View style={{ backgroundColor: '#ffffff' }}>
  <Text style={{ color: '#000000' }}>Text</Text>
</View>
```

### ✅ DO: Keep brand colors consistent (like your blue accent)

```tsx
// Good - brand colors can stay the same in both themes
<Text style={{ color: '#2563eb' }}>$99.99</Text>
```

## Example: Product Detail Screen

See [app/product/[id].tsx](app/product/[id].tsx) for a complete example of theme usage:

```tsx
import { useTheme } from '@react-navigation/native';

export default function ProductDetailScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.productName, { color: theme.colors.text }]}>
        Product Name
      </Text>
      {/* Brand colors stay the same */}
      <Text style={styles.price}>$99.99</Text>
    </View>
  );
}
```

## Testing Dark Mode

### On iOS Simulator
Settings → Developer → Dark Appearance

### On Android Emulator
Settings → Display → Dark theme

### On Web (Browser)
- **Chrome/Edge**: Settings → Appearance → Theme
- **Safari**: System Preferences → General → Appearance
- **Or use Chrome DevTools**: Cmd+Shift+P → "Rendering" → Emulate CSS prefers-color-scheme

### Programmatically Toggle (for testing)
You can temporarily modify `app/_layout.tsx` to force a theme:

```tsx
// Force dark mode for testing
<ThemeProvider value={DarkTheme}>

// Force light mode for testing
<ThemeProvider value={DefaultTheme}>
```

## Creating Custom Themes

You can create custom themes by extending the default ones:

```tsx
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563eb',    // Your brand blue
    background: '#f9fafb',
    card: '#ffffff',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#3b82f6',    // Lighter blue for dark mode
    background: '#111827',
    card: '#1f2937',
  },
};

// Then use in your provider:
<ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
```

## Summary

1. ✅ Theme is already set up and working
2. ✅ Import `useTheme` from `@react-navigation/native`
3. ✅ Use `theme.colors.background`, `theme.colors.text`, etc. for dynamic colors
4. ✅ Keep brand colors (like your blue) hardcoded if they should stay consistent
5. ✅ Test on both light and dark modes to ensure good contrast
