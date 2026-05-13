# Flat Hunt 🏢

Flat Hunt is a dynamic, mobile-first residential property evaluation and comparison tool. It allows users to quickly log property details, evaluate them against a predefined set of "must-haves" and "deal-breakers," and directly compare different properties side-by-side using an automated scoring algorithm.

## Features ✨

- **Passwordless Login:** Quick session-based login using just a username.
- **Dynamic Form Engine:** The entire property entry form is powered by a central JSON configuration (`fields.json`), making it extremely easy to add or remove property attributes.
- **Auto-Save:** Form entries are automatically saved to the cloud using a debounced autosave feature.
- **Smart Scoring:** Properties are scored automatically out of 100%. "Must-haves" boost the score, while missing "Deal-breakers" heavily penalize the score and highlight the issue in red.
- **Side-by-Side Comparison:** Select 2-4 properties to view them in a horizontal, sticky-header comparison table that clearly visualizes strengths and weaknesses.
- **Modern Aesthetic:** Built with the Stitch design system, featuring a sleek, glassmorphism-inspired "drawn line" background, thumb-friendly touch targets, and a beautiful Indigo/Green/Red color palette.

## Tech Stack 🛠️

- **Frontend Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (v3) with Custom Design Tokens
- **State Management:** Zustand (with local storage persistence)
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security)
- **Deployment:** Vercel Ready (`vercel.json` included)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (Optional, for managing the database)

## Getting Started 🚀

### 1. Clone the repository

```bash
git clone https://github.com/alok722/home-hunt.git
cd home-hunt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory of the project and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*Note: The `.env.local` file is explicitly ignored in Git to prevent accidental leaking of credentials.*

### 4. Setup Database

If you have linked the project via the Supabase CLI, you can push the required schema:

```bash
npx supabase db push
```

Alternatively, you can manually execute the SQL located in `supabase/migrations/20260513171207_init_schema.sql` directly in your Supabase SQL editor.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Customization ⚙️

To change the form fields, open `src/config/fields.json`. The application's UI, form inputs, validation, and comparison table will automatically adapt to any changes made to this file. 

Supported field types: `text`, `number`, `boolean` (toggle), `select`, `dimension`, `rating`.

## License
MIT License
