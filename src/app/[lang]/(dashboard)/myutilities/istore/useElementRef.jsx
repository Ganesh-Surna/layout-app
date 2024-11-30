import { useRef } from 'react';

const useElementRef = () => {
  const elementRef = useRef(null);

  return elementRef;
};

export default useElementRef;
