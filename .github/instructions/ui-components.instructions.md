---
description: Read this before implementing or modifying UI components in the project.
---

# UI Components

All UI in this app is built exclusively with **shadcn/ui**. Do not create custom components.

## Rules

- **shadcn/ui only.** Never hand-roll custom UI components (buttons, inputs, dialogs, cards, etc.).
- **Add components via the CLI**, never by hand-editing files in `components/ui/`:
  ```bash
  npx shadcn@latest add <component>
  ```
- **Do not edit `components/ui/`** — these files are managed by the shadcn CLI and will be overwritten.
- Compose shadcn primitives together to build more complex UI — do not reach for a custom implementation.

## Available Components

Check `components/ui/` for already-installed components before adding new ones. Only install what is needed for the current task.

## Styling

- Use Tailwind utility classes for layout and spacing adjustments on top of shadcn components.
- Use the `cn()` helper from `lib/utils.ts` for all conditional class merging.
