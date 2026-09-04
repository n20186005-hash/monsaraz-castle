import './globals.css';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// The root layout simply hosts the locale segments: the <html>/<body>
// elements and per-language <head> output live in `[locale]/layout.tsx`.
export default function RootLayout({ children }: Props) {
  return children;
}
