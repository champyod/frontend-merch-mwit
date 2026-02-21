# Overnight Backlog Audit (Frontend + API)

Generated: 2026-02-22

## Critical Integration Gaps (Broken / High Risk)

1. **RBAC role mismatch between frontend and API**
   - Frontend checks `user.role === "admin"` in:
     - `src/contexts/auth-context.tsx`
     - `src/app/[locale]/admin/layout.tsx`
     - `src/components/ui/HeaderBar.tsx`
     - `src/components/ui/UserMenu.tsx`
   - API grants/admin-guards with `super-admin` (`internal/middleware/admin_only.go`).
   - **Impact:** Real super-admin users can be blocked from frontend admin UX; route guards inconsistent.
   - **Fix direction:** Standardize on one role token (`super-admin`) across frontend checks.

2. **Admin Pages feature calls endpoints that are not routed in API**
   - Frontend page management (`src/app/[locale]/admin/pages/*`) calls:
     - `PUT /page` (reorder)
     - `/api/page` + `/api/page/:id` (create/edit/delete)
   - API router currently exposes only:
     - `GET /page`
     - `POST /admin/pages`
   - Backend handlers exist for `UpdateMenuOrder`, `EditPage`, `DeletePage`, but not wired in `internal/routes/router.go`.
   - **Impact:** Page management partially/non-functional.

3. **Site settings method mismatch**
   - Frontend settings uses `PUT ${API_BASE_URL}/site` (`src/app/[locale]/admin/settings/page.tsx`).
   - API admin route is `POST /admin/site` (`internal/routes/router.go`).
   - **Impact:** Save settings likely fails or hits wrong endpoint.

## Frontend-Only Structural/Rule Violations

1. **Page-level UI logic/style in app pages (should be moved to components folder)**
   - `src/app/[locale]/admin/pages/page.tsx`
   - `src/app/[locale]/admin/pages/AddPage.tsx`
   - `src/app/[locale]/admin/pages/EditPage.tsx`
   - `src/app/[locale]/admin/pages/MenuOrderSort.tsx`
   - `src/app/[locale]/admin/settings/page.tsx`
   - These still define substantial UI + API interaction directly in app route files.

2. **Direct API calls in app pages instead of hooks/lib separation**
   - `admin/pages` and `admin/settings` routes call `fetch` directly.
   - Violates rules: API usage in hooks; business logic in lib.

## API-Only / Backend Structure Gaps

1. **Page handlers implemented but route exposure incomplete**
   - Implemented in `internal/handlers/page/page.go`:
     - `UpdateMenuOrder`, `EditPage`, `DeletePage`
   - Not mounted in router.

2. **Atlas schema scaffold exists but migration lifecycle not yet operationalized**
   - Added: `atlas.hcl`, `atlas/schema.sql`, make targets.
   - Missing: generated versioned migrations in `atlas/migrations/` and CI/compose runtime mode conventions.

## UI/UX Bugs / Suspected Defects

1. **Loading screen logo appears in wrong position (reported)**
   - Current loading screen: `src/app/[locale]/loading.tsx` + `src/components/ui/Loader.tsx`.
   - Needs reproducible check and potential z-index/layout isolation fix if header/logo bleeds through during transitions.

2. **Admin pages UX inconsistency (legacy styles vs ui primitives)**
   - `admin/pages/*` and `admin/settings/page.tsx` use legacy styling/buttons/forms.
   - Visual and interaction inconsistency with new admin sections.

## Suggested Overnight Commit Plan

1. **Commit A (Critical Auth):** unify role checks to `super-admin` in frontend auth/layout/header/usermenu.
2. **Commit B (Critical Pages API):** wire page update/edit/delete routes in API router under admin namespace.
3. **Commit C (Critical Settings API):** align frontend settings endpoint/method with API (`/admin/site`, POST or API change to PUT).
4. **Commit D (Frontend Refactor Pages Domain):** move `admin/pages/*` UI to `src/components/admin/pages/*`; move API calls to hooks, logic to lib.
5. **Commit E (Frontend Refactor Settings Domain):** move settings UI to component folder and hook-based API usage.
6. **Commit F (Loading UX bugfix):** reproduce and fix loading-overlay/logo positioning issue.
7. **Commit G (Atlas readiness):** generate and commit initial migration files, document env mode in docker/README.

## Build Verification Rule (Required)
- Frontend validation command: `bun run build`
- API validation command: `make docker-build`
- Run both after each commit batch.
