import { redirect } from 'next/navigation';

// For dynamic deployments the middleware intercepts requests to `/` and
// redirects to the default locale (`/pt`). This page is a safety net when
// the app is served without the middleware (e.g. static preview).
export default function RootPage() {
  redirect('/pt');
}