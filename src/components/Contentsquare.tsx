'use client';

import { useEffect } from 'react';
import { injectContentsquareScript } from '@contentsquare/tag-sdk';

const CONTENTSQUARE_TAG_ID = 'f764927cc0b42';

export default function Contentsquare() {
  useEffect(() => {
    injectContentsquareScript({ clientId: CONTENTSQUARE_TAG_ID });
  }, []);

  return null;
}
