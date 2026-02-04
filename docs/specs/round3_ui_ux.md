# Round 3: UI/UX & Reliability Specification

## Context
Goal: Elevate "AI Code Mentor" to a Premium Aesthetic using **Stitch** principles (Glassmorphism, Neon, Dark Mode) and ensure robust Accessibility via **Radix UI** primitives.

## Phase 1: Foundation (Design System)
### 1.1 Stitch Design Tokens
**File**: `styles/globals.css`
**Strategy**: CSS Variables for theming.

```css
:root {
  /* Stitch Color Palette (Neon & Glass) */
  --stitch-bg-main: #0a0a0c; /* Deep Space */
  --stitch-surface-glass: rgba(255, 255, 255, 0.05);
  --stitch-border-glass: rgba(255, 255, 255, 0.1);
  
  --stitch-neon-blue: #00f0ff;
  --stitch-neon-purple: #bd00ff;
  --stitch-neon-green: #00ff9d;

  /* Typography */
  --font-mono: 'JetBrains Mono', monospace; /* Tech feel */
}

/* Utility Classes layer (if using Tailwind, extending config) */
.glass-panel {
  background: var(--stitch-surface-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--stitch-border-glass);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

## Phase 2: Core Components (Radix UI)
### 2.1 Unified Dashboard Tabs
**File**: `pages/panel-de-control.js`
**Component**: `@radix-ui/react-tabs`

**Current State**: Hand-rolled `<div>` buttons.
**New State**:
```jsx
import * as Tabs from '@radix-ui/react-tabs';

<Tabs.Root defaultValue="unified" className="flex flex-col gap-6">
  <Tabs.List className="glass-panel p-1 rounded-xl flex gap-2">
    <Tabs.Trigger value="unified" className="data-[state=active]:bg-white/10 ...">
      Dashboard
    </Tabs.Trigger>
    <Tabs.Trigger value="sandbox">Sandbox</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="unified"> <EnhancedUnifiedDashboard /> </Tabs.Content>
  <Tabs.Content value="sandbox"> <SandboxWidget /> </Tabs.Content>
</Tabs.Root>
```

### 2.2 API Usage Warning Modals
**File**: `components/APIUsageCounter.js`
**Component**: `@radix-ui/react-dialog`

**Current State**: Custom absolute positioned divs.
**New State**:
```jsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root open={isWarningOpen}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
    <Dialog.Content className="glass-panel fixed top-[50%] left-[50%] ...">
      <Dialog.Title>Limit Reached</Dialog.Title>
      <Dialog.Description>...</Dialog.Description>
      <Dialog.Close>Dismiss</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Phase 3: Dependencies
`npm install @radix-ui/react-tabs @radix-ui/react-dialog @radix-ui/react-icons class-variance-authority clsx tailwind-merge`

## Verification Plan
1.  **Visual**: Check "Glass" effect stability on dark backgrounds.
2.  **A11y**: Tab through dashboard tabs. Verify Focus rings.
3.  **E2E**: Update Playwright selectors to target `role="tab"` and `role="dialog"`.
