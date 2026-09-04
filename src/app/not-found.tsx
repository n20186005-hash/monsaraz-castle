import { redirect } from 'next/navigation';

// Unmatched root-level paths (e.g. "/xyz" with no locale prefix) fall back
// here and are redirected to the default locale; the per-locale 404 UI lives
// in `[locale]/not-found.tsx`.
export default function RootNotFound() {
  redirect('/pt');
}
