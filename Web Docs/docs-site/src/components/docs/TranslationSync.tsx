'use client';

import { syncStoredTranslation } from '@/lib/google-translate';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function DocsTranslationSync() {
  const pathname = usePathname();

  useEffect(() => {
    syncStoredTranslation();
  }, [pathname]);

  return null;
}
