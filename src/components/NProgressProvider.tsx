'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { Suspense } from 'react';

// Configure NProgress
NProgress.configure({ showSpinner: false });

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export function NProgressProvider() {
  return (
    <Suspense fallback={null}>
      <NavigationEvents />
    </Suspense>
  );
}
