import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BREADCRUMBS_PORTAL_ID } from 'core/constants';

export function BreadcrumbsPortal({ children }) {
  const ref = useRef<HTMLElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.getElementById(BREADCRUMBS_PORTAL_ID);
    setMounted(true);
  }, []);

  return mounted ? createPortal(children, ref.current) : null;
}
