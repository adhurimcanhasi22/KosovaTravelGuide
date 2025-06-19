'use client';

import { Suspense } from 'react';

export default function SubmitReviewLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading review form...</div>}>{children}</Suspense>
  );
}
