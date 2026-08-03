# SIGEDOC Frontend Context

## Architecture
- **Framework**: Angular 18+ (Standalone Components, Signals API)
- **Styling**: Tailwind CSS
- **Component Pattern**: 
  - `Metasystem`: Core UI library components (Action Buttons, Inputs, Layout).
  - `Workspace`: Business logic, views, forms, and pages grouped by feature (`operatividad`, `database`, `system`).
- **Base Controllers**: We extensively use `BaseFormController` to drive CRUD forms, keeping components thin and delegating logic to the Base Controller.
- **State Management**: Angular `Signals` (`signal`, `computed`, `effect`) are the primary state primitives. We avoid RxJS except for HTTP interceptors and Router events.
- **Tenancy**: The `TenantService` manages the active institution and injects headers/state for API calls.

## Conventions
- SVGs must not be raw in HTML; they should be mapped in `app.icon.map.ts` and rendered via `<icon>`.
- Buttons must use `<action-button>` instead of raw `<button>`.
- Use `inject()` instead of constructor injection.
- Keep `imports` array clean in standalone components.
- Components should declare their layout responsibilities clearly (e.g., full width, grid, flex).
