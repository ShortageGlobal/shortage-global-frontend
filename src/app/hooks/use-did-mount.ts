import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

// useEffect that does not fire callback on mount
export function useDidMountEffect(
  func: EffectCallback,
  dependencies: DependencyList
) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      return func();
    } else {
      didMount.current = true;
    }
  }, dependencies);
}

export default useDidMountEffect;
