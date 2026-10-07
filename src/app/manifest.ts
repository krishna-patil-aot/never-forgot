import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NeverForgot — I Can Never Forget Your Bill Dates & Warranties',
    short_name: 'NeverForgot',
    description:
      'Universal AI-powered bill, warranty, and insurance expiry vault. Never forget payment deadlines, renewal windows, or free warranty coverage again.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0891b2',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
