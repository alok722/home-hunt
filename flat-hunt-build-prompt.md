# Flat Hunt — Full App Build Prompt

## Goal

Build a mobile-first React web app called **Flat Hunt** that lets a user evaluate and compare residential flat/apartment projects in India. The user enters a username on first load; all their data is stored in Supabase under that username. No passwords, no email — just a name as a personal identifier. The app must work equally well on a phone browser and a laptop browser.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Global State | Zustand |
| Database | Supabase (PostgreSQL, free tier) |
| Supabase Client | `@supabase/supabase-js` v2 |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Icons | `lucide-react` |
| Deployment | Vercel (zero-config) |

---

## Supabase Schema

Run this SQL in the Supabase SQL editor to set up the database:

```sql
-- Users table (username only, no auth)
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  created_at timestamptz default now()
);

-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookup by user
create index on projects(user_id);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on projects
for each row execute function update_updated_at();

-- Enable Row Level Security (open read/write since no auth)
alter table users enable row level security;
alter table projects enable row level security;

create policy "Public access for users" on users for all using (true) with check (true);
create policy "Public access for projects" on projects for all using (true) with check (true);
```

---

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Store these in `.env.local` locally and in Vercel project settings for deployment.

---

## Field Config JSON

This is the single source of truth for all form fields. Store it as `src/config/fields.json`. The entire form UI is driven by this config — adding, removing, or reordering a field should require only a change here, with no other code changes.

```json
[
  {
    "section": "Basic Requirements",
    "icon": "LayoutGrid",
    "fields": [
      {
        "id": "config_type",
        "label": "Configuration",
        "type": "select",
        "options": ["2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK", "4 BHK"],
        "tag": "must",
        "note": "Unit type you are looking for"
      },
      {
        "id": "carpet_area",
        "label": "Carpet area (sq ft)",
        "type": "number",
        "placeholder": "e.g. 1050",
        "tag": "must",
        "note": "As per RERA-defined carpet area"
      },
      {
        "id": "floor",
        "label": "Floor number",
        "type": "number",
        "placeholder": "e.g. 7"
      },
      {
        "id": "facing",
        "label": "Flat facing",
        "type": "select",
        "options": ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"]
      },
      {
        "id": "is_corner_unit",
        "label": "Corner unit",
        "type": "boolean",
        "note": "Better ventilation and natural light"
      },
      {
        "id": "total_cost_lakhs",
        "label": "All-in cost (₹ lakhs)",
        "type": "number",
        "placeholder": "e.g. 95",
        "tag": "must",
        "note": "Agreement value + stamp duty + registration + GST + parking"
      }
    ]
  },
  {
    "section": "Room Dimensions",
    "icon": "DoorOpen",
    "fields": [
      {
        "id": "master_bed_size",
        "label": "Master bedroom (ft)",
        "type": "dimension",
        "note": "Length × Width, e.g. 13 × 12",
        "tag": "must"
      },
      {
        "id": "bed2_size",
        "label": "Bedroom 2 (ft)",
        "type": "dimension",
        "note": "Length × Width"
      },
      {
        "id": "bed3_size",
        "label": "Bedroom 3 (ft)",
        "type": "dimension",
        "note": "Leave blank if 2 BHK"
      },
      {
        "id": "living_dining_size",
        "label": "Living + Dining (ft)",
        "type": "dimension",
        "note": "Combined area"
      },
      {
        "id": "kitchen_size",
        "label": "Kitchen (ft)",
        "type": "dimension",
        "note": "Usable floor area"
      },
      {
        "id": "balcony_depth_ft",
        "label": "Balcony depth (ft)",
        "type": "number",
        "placeholder": "e.g. 5",
        "note": "Usable depth ≥ 4 ft preferred"
      }
    ]
  },
  {
    "section": "Construction Quality",
    "icon": "Building2",
    "fields": [
      {
        "id": "is_mivan",
        "label": "Mivan (aluminium formwork) construction",
        "type": "boolean",
        "note": "Stronger RCC walls, better finish"
      },
      {
        "id": "no_seepage",
        "label": "No seepage or cracks visible",
        "type": "boolean",
        "tag": "deal-breaker",
        "note": "Check walls, ceiling corners, bathrooms"
      },
      {
        "id": "flooring_type",
        "label": "Flooring type",
        "type": "select",
        "options": ["Vitrified tiles", "Marble", "Granite", "Ceramic tiles", "Wooden/Laminate", "Not specified"]
      },
      {
        "id": "cp_fittings_brand",
        "label": "CP fittings brand",
        "type": "select",
        "options": ["Jaquar", "Kohler", "Grohe", "Hindware", "Cera", "Basic / Unknown"]
      },
      {
        "id": "is_concealed_wiring",
        "label": "Concealed wiring with MCB panel",
        "type": "boolean"
      },
      {
        "id": "window_type",
        "label": "Window frame type",
        "type": "select",
        "options": ["UPVC", "Aluminium", "Steel", "Wood", "Not specified"]
      }
    ]
  },
  {
    "section": "Building & Society",
    "icon": "Building",
    "fields": [
      {
        "id": "is_rera_registered",
        "label": "RERA registered",
        "type": "boolean",
        "tag": "must",
        "note": "Verify on Karnataka RERA portal"
      },
      {
        "id": "rera_number",
        "label": "RERA number",
        "type": "text",
        "placeholder": "e.g. PRM/KA/RERA/1251/..."
      },
      {
        "id": "oc_status",
        "label": "OC (Occupancy Certificate) status",
        "type": "select",
        "options": ["Received", "Applied", "Expected soon", "Not yet", "Not applicable (under construction)"],
        "tag": "deal-breaker"
      },
      {
        "id": "lift_count",
        "label": "Number of lifts",
        "type": "number",
        "placeholder": "e.g. 2"
      },
      {
        "id": "is_covered_parking",
        "label": "Covered car parking included",
        "type": "boolean",
        "tag": "must"
      },
      {
        "id": "parking_type",
        "label": "Parking type",
        "type": "select",
        "options": ["Stilt", "Basement", "Mechanical stack", "Open", "Not included"]
      },
      {
        "id": "power_backup",
        "label": "Power backup",
        "type": "select",
        "options": ["Full (all points)", "Partial (lights + fans + lifts)", "Only lifts", "None"]
      },
      {
        "id": "is_24x7_security",
        "label": "24/7 security with CCTV",
        "type": "boolean"
      },
      {
        "id": "water_source",
        "label": "Water supply source",
        "type": "select",
        "options": ["BWSSB + Borewell (dual)", "BWSSB only", "Borewell only", "Tanker dependent"],
        "tag": "must"
      },
      {
        "id": "maintenance_psf",
        "label": "Maintenance charge (₹/sq ft/month)",
        "type": "number",
        "placeholder": "e.g. 3.5"
      }
    ]
  },
  {
    "section": "Amenities",
    "icon": "Waves",
    "fields": [
      {
        "id": "has_play_area",
        "label": "Children's play area",
        "type": "boolean"
      },
      {
        "id": "has_clubhouse_gym",
        "label": "Clubhouse with gym",
        "type": "boolean"
      },
      {
        "id": "has_swimming_pool",
        "label": "Swimming pool",
        "type": "boolean"
      },
      {
        "id": "has_visitor_parking",
        "label": "Dedicated visitor parking",
        "type": "boolean"
      },
      {
        "id": "has_stp",
        "label": "STP / waste management system",
        "type": "boolean"
      },
      {
        "id": "has_ev_charging",
        "label": "EV charging provisions",
        "type": "boolean"
      }
    ]
  },
  {
    "section": "Location & Connectivity",
    "icon": "MapPin",
    "fields": [
      {
        "id": "commute_mins",
        "label": "Commute to office (peak, mins)",
        "type": "number",
        "placeholder": "e.g. 35",
        "tag": "must"
      },
      {
        "id": "metro_distance_km",
        "label": "Nearest metro distance (km)",
        "type": "number",
        "placeholder": "e.g. 1.2"
      },
      {
        "id": "essentials_within_500m",
        "label": "Daily essentials within 500 m",
        "type": "boolean",
        "note": "Grocery, medical, milk booth"
      },
      {
        "id": "hospital_within_5km",
        "label": "Multi-speciality hospital within 5 km",
        "type": "boolean"
      },
      {
        "id": "no_major_nuisance",
        "label": "No major nuisance nearby",
        "type": "boolean",
        "tag": "deal-breaker",
        "note": "No cremation ground, HT lines, nala encroachment"
      },
      {
        "id": "not_flood_zone",
        "label": "Not in flood / low-lying zone",
        "type": "boolean",
        "tag": "deal-breaker",
        "note": "Verify on BBMP/BDA flood zone maps"
      }
    ]
  },
  {
    "section": "Legal & Documentation",
    "icon": "FileBadge",
    "fields": [
      {
        "id": "clear_title_ec",
        "label": "Clear title / EC obtained",
        "type": "boolean",
        "tag": "deal-breaker",
        "note": "EC from sub-registrar — no pending loans on land"
      },
      {
        "id": "khata_type",
        "label": "Khata type",
        "type": "select",
        "options": ["A-Khata", "B-Khata", "Not checked yet"],
        "tag": "deal-breaker",
        "note": "B-Khata properties cannot get home loans"
      },
      {
        "id": "plan_sanction_available",
        "label": "Building plan sanction copy available",
        "type": "boolean",
        "tag": "must",
        "note": "Approved by BBMP/BDA/BMRDA"
      },
      {
        "id": "lawyer_reviewed",
        "label": "Sale deed reviewed by independent lawyer",
        "type": "boolean",
        "tag": "must"
      },
      {
        "id": "home_loan_approved_by",
        "label": "Home loan approved by",
        "type": "select",
        "options": ["Multiple nationalised banks", "Single nationalised bank", "Private bank only", "HFC only", "Not checked"]
      },
      {
        "id": "no_tax_dues",
        "label": "No pending property tax dues",
        "type": "boolean"
      }
    ]
  },
  {
    "section": "Personal Notes",
    "icon": "NotebookPen",
    "fields": [
      {
        "id": "visit_date",
        "label": "Site visit date",
        "type": "date"
      },
      {
        "id": "overall_rating",
        "label": "Overall gut rating",
        "type": "rating",
        "note": "Your personal feel (1–5 stars)"
      },
      {
        "id": "pros",
        "label": "Pros",
        "type": "textarea",
        "placeholder": "What stood out positively..."
      },
      {
        "id": "cons",
        "label": "Cons",
        "type": "textarea",
        "placeholder": "Concerns or red flags..."
      },
      {
        "id": "negotiated_price_lakhs",
        "label": "Negotiated / quoted price (₹ lakhs)",
        "type": "number",
        "placeholder": "e.g. 88"
      }
    ]
  }
]
```

---

## App Structure

```
src/
├── config/
│   └── fields.json          ← The field config above
├── lib/
│   └── supabase.js          ← Supabase client init
├── store/
│   └── useStore.js          ← Zustand store (user, projects)
├── components/
│   ├── FieldRenderer.jsx    ← Renders any field type from config
│   ├── SectionAccordion.jsx ← Collapsible section wrapper
│   ├── ProjectCard.jsx      ← Card used in list + compare views
│   └── TagBadge.jsx         ← "must" / "deal-breaker" badge
├── pages/
│   ├── LoginPage.jsx        ← Username entry screen
│   ├── ProjectListPage.jsx  ← Home: list of all projects
│   ├── ProjectFormPage.jsx  ← Add / Edit a project
│   └── ComparePage.jsx      ← Side-by-side comparison
├── App.jsx
└── main.jsx
```

---

## Screens & Behaviour

### 1. Login Page (`/`)
- Full-screen centered card on mobile
- Single text input: "What's your name?" with a large, friendly font
- On submit: query Supabase `users` table for that username
  - If found → load their projects → go to `/projects`
  - If not found → create a new user row → go to `/projects`
- Store `user_id` and `username` in Zustand + `localStorage` so the user stays logged in on refresh
- A small "Not you?" link at the top of the projects page to clear the stored username and return to login

### 2. Project List Page (`/projects`)
- Header: "Hi, [username]" + **+ Add Project** button (prominent, fixed bottom on mobile)
- Shows a vertically scrollable list of `ProjectCard` components, one per saved project
- Each `ProjectCard` shows:
  - Project name (large)
  - Configuration + carpet area + cost (3 key fields as pills)
  - Overall rating (stars, if filled)
  - Completion indicator: "X / 44 fields filled" as a small progress bar
  - Deal-breaker warning icon if any deal-breaker fields are empty or flagged negatively
  - Edit (pencil icon) and Delete (trash icon) action buttons
- **Compare mode**: a "Compare" button appears in the header; tapping it lets the user select 2–4 projects via checkbox, then tapping "Compare Selected" navigates to `/compare`
- Empty state: friendly illustration + "Add your first project to get started" message

### 3. Project Form Page (`/projects/new` and `/projects/:id/edit`)
- Full-page form, mobile-scrollable
- At the top: large input for **Project Name** (mandatory)
- Below: sections from `fields.json`, rendered as collapsible accordions (`SectionAccordion`)
  - Each accordion shows section name, icon, and a "X/Y filled" count badge
  - Sections are expanded one at a time by default on mobile (accordion behaviour); on desktop, all can be expanded simultaneously
- **FieldRenderer** component handles each field type:
  - `boolean` → large toggle switch (not a checkbox) with the label inline — easy to tap
  - `select` → native `<select>` on mobile / custom styled dropdown on desktop
  - `number` → numeric keyboard input (`inputMode="numeric"`) with unit label alongside
  - `text` → standard text input
  - `textarea` → auto-growing textarea (min 2 rows)
  - `dimension` → two side-by-side number inputs (L × W) with "×" separator
  - `date` → native date picker
  - `rating` → 5 large tappable stars (finger-friendly, minimum 44 px tap targets)
- **Tag badges**: fields with `"tag": "must"` show a red "must" pill next to the label; `"tag": "deal-breaker"` shows an orange "deal-breaker" pill
- **Auto-save**: debounced save to Supabase 1.5 seconds after any field change (no explicit save button needed) — show a subtle "Saving…" / "Saved ✓" indicator in the header
- A manual **Save & Back** button at the bottom as a fallback
- On new project creation, navigate to the form immediately on name entry (don't make the user save first)

### 4. Compare Page (`/compare?ids=...`)
- Receives 2–4 project IDs via query params
- **Summary card strip** (sticky at top, horizontally scrollable): one card per project showing name, config, cost, rating, and a colour-coded score (see scoring below)
- **Detail comparison table** below: rows = fields from `fields.json`, columns = projects
  - Group rows by section with a section header row
  - Colour-code cells: green if a boolean is `true` / a "must" field is filled; red if a deal-breaker boolean is `false` or a deal-breaker field is empty
  - For `number` fields, highlight the best value (e.g. lowest cost, shortest commute, largest area) in green
  - Sticky first column on mobile showing the field label
- **Scoring logic** (shown on summary card):
  - Each filled "must" field = +3 points
  - Each filled non-must field = +1 point
  - Each deal-breaker field that is `false` or unfilled = −5 points
  - `overall_rating` (1–5 stars) = ×3 multiplier added to score
  - Display as a score out of a calculated maximum, with a coloured badge (green ≥ 70%, amber 40–69%, red < 40%)
- A **Back** button and **Edit** shortcut for each project

---

## Key Implementation Details

### FieldRenderer Component
This is the most critical component. It must:
1. Accept a field definition object (from `fields.json`) and a value + onChange handler as props
2. Return the appropriate input element based on `field.type`
3. Show `field.note` as a small muted helper text below the input
4. Show the tag badge if `field.tag` is set
5. Never require changes outside this file when a new field type is added to the config

### Zustand Store shape
```js
{
  user: { id, username } | null,
  projects: [ { id, name, data: {}, created_at, updated_at } ],
  setUser: (user) => void,
  setProjects: (projects) => void,
  upsertProject: (project) => void,
  deleteProject: (id) => void,
}
```

### Supabase helper functions (in `src/lib/supabase.js`)
Export these named functions:
- `getOrCreateUser(username)` → returns user row
- `fetchProjects(userId)` → returns all projects for user
- `saveProject(project)` → upsert by id
- `deleteProject(id)` → delete by id

### Responsive layout
- Mobile (< 640 px): single column, accordions open one at a time, bottom floating action button
- Tablet / Desktop (≥ 640 px): two-column form layout where possible, all accordions can be open simultaneously, compare table uses horizontal scroll with frozen first column

---

## UX & Polish Details

- Use a clean, minimal design — white cards on a light grey background, no heavy gradients
- Colour palette: primary accent = indigo-600; success = green-600; warning = amber-500; danger = red-600
- All tap targets must be ≥ 44 px tall on mobile
- Boolean toggles should be large and thumb-friendly (at least 52 px wide)
- Show a skeleton loader while fetching projects from Supabase
- Show a toast notification (bottom of screen) for save success / error
- The "deal-breaker" warning on the project card should be visually prominent — use a red banner or icon strip, not a subtle badge
- Empty fields in the compare table should show a muted "—" not blank space
- On the compare page, tapping a project name on the summary card should navigate to that project's edit form

---

## Deployment Checklist (include as a README section)

1. Create a Supabase project at supabase.com (free tier)
2. Run the SQL schema above in the Supabase SQL Editor
3. Copy the Project URL and anon key from Supabase → Settings → API
4. Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Run `npm install && npm run dev` to test locally
6. Push to GitHub
7. Import the repo in Vercel, add the two env variables in Vercel project settings, deploy

---

## What Should NOT Be Hardcoded

The following must be driven purely by `fields.json` and must not be hardcoded anywhere in the React components:
- List of sections and their order
- List of fields within each section
- Field types and their labels
- Which fields are "must" or "deal-breaker"
- Field notes / helper text
- Dropdown options for `select` fields

If a developer needs to add a new field (e.g. "Number of total floors in building"), they should only need to add one object to `fields.json` and it must appear automatically in the form, the compare table, and the scoring logic.
