import React, { Children } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

/*
  Sets 'active' prop to children. Used in Navbar.
  Inspired by: https://github.com/vercel/next.js/tree/canary/examples/active-class-name 
*/
export function ActiveLink({ children, href, ...props }) {
  const { asPath } = useRouter();
  const child = Children.only(children);

  // pages/index.tsx will be matched via href
  // pages/for-individuals.tsx will be matched via href
  // pages/[slug].tsx will be matched via props.as
  const isActive = asPath === href || asPath === props.as;

  return (
    <Link href={href} {...props} legacyBehavior>
      {React.cloneElement(child, {
        active: isActive,
      })}
    </Link>
  );
}
