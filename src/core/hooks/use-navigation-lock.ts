import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useNavigationLock(
  isEnabled = true,
  warningText = 'You have unsaved changes - are you sure you wish to leave this page?'
) {
  const router = useRouter();

  useEffect(() => {
    const handleWindowsClose = (e: BeforeUnloadEvent) => {
      if (!isEnabled) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };

    const handleBrowserAway = () => {
      if (!isEnabled) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange abandoned';
    };

    window.addEventListener('beforeunload', handleWindowsClose);

    router.events.on('routeChangeStart', handleBrowserAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowsClose);
      router.events.off('routeChangeStart', handleBrowserAway);
    };
  }, [isEnabled]);
}
