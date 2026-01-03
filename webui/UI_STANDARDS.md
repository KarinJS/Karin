# UI Development Standards

## Core Principle

**All page-related components MUST use [HeroUI](https://www.heroui.com/) if a corresponding component exists in the library.**

This ensures consistency in design, accessibility, and behavior across the entire application.

## Documentation

- **Official Component Library**: [https://www.heroui.com/docs/components](https://www.heroui.com/docs/components)

## Guidelines

### 1. Component Selection

Before implementing any UI element, check the HeroUI documentation. If a component exists, use it instead of native HTML elements or other libraries.

| UI Element | ❌ Do Not Use | ✅ Use HeroUI Component |
|------------|---------------|-------------------------|
| Button | `<button>`, `<div>` | `<Button>` |
| Text Input | `<input type="text">` | `<Input>` |
| Checkbox/Switch | `<input type="checkbox">` | `<Checkbox>`, `<Switch>` |
| Layout Containers | `<div>` with custom CSS | `<Card>`, `<CardBody>`, `<Divider>` |
| Navigation | `<ul>`, `<a>` | `<Navbar>`, `<Link>`, `<Tabs>` |
| Loading State | Custom spinners | `<Spinner>`, `isLoading` prop on Buttons |
| Overlays | Custom modals | `<Modal>`, `<Popover>`, `<Tooltip>` |

### 2. Styling

- Use **Tailwind CSS** for layout and spacing.
- Leverage HeroUI's built-in props (e.g., `color`, `size`, `variant`) for component-specific styling.
- Avoid writing custom CSS classes for standard component states (hover, focus, etc.) as HeroUI handles these automatically.

### 3. Icons

- Use **Lucide React** for icons, as it pairs well with HeroUI.
- Example: `<Button startContent={<Save size={18} />}>Save</Button>`

## Example Usage

```tsx
// ✅ Correct
import { Button, Input, Card, CardBody } from "@heroui/react";

export function LoginForm() {
  return (
    <Card>
      <CardBody className="gap-4">
        <Input label="Email" type="email" variant="bordered" />
        <Input label="Password" type="password" variant="bordered" />
        <Button color="primary">Login</Button>
      </CardBody>
    </Card>
  );
}

// ❌ Incorrect
export function LoginForm() {
  return (
    <div className="card">
      <div className="card-body">
        <input className="border p-2" placeholder="Email" />
        <input className="border p-2" placeholder="Password" type="password" />
        <button className="bg-blue-500 text-white p-2">Login</button>
      </div>
    </div>
  );
}
```
