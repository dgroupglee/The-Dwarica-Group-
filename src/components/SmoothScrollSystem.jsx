import { useEffect } from 'react';
import { initLenis } from '../utils/lenisScroll';

export default function SmoothScrollSystem() {
  useEffect(() => initLenis(), []);
  return null;
}
