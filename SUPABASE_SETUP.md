# Supabase setup for 3M Paradigms

## 1. Configure local environment

Create a file named `.env.local` in the repository root (the same folder as `package.json`). Do not commit this file.

Add the following, replacing the placeholder with the publishable key from your Supabase dashboard:

```env
VITE_SUPABASE_URL=https://wgxqwfvxydspgiqpmzgk.supabase.co
VITE_SUPABASE_ANON_KEY=PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE
```

The project accepts a Supabase publishable key (`sb_publishable_...`) in this variable. The variable name is retained for compatibility with the current frontend code.

## 2. Run the site locally

Install Node.js 22, open a terminal in the repository folder, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. After changing `.env.local`, restart the Vite development server.

To verify a production build, run:

```bash
npm run build
```

## 3. Verify Supabase access

- The public services section can read rows from `public.services` allowed by the table's RLS policies.
- The contact form submits only `full_name`, `email`, `organization`, `service_interest`, and `message` to `public.inquiries`.
- Confirm a test enquiry appears in Supabase Table Editor, then remove the test record if appropriate.
- If the submission fails, inspect the browser console and Supabase logs. Check that the table's insert policy and column grants match these fields.

## Security

- Never use a Supabase `service_role` key or secret key in frontend code.
- Keep `.env.local` out of Git. The repository `.gitignore` already excludes `.env` and `.env.*`, while allowing `.env.example`.
- Publishable keys are designed to be used in browsers; RLS policies must still restrict data access.
- Before production launch, add anti-spam protections/rate limits and test all policies with an unauthenticated visitor.
