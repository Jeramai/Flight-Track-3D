import { Sphere, useTexture } from '@react-three/drei';
import { useRef } from 'react';

useTexture.preload('earth.webp');

export default function Earth() {
  const earthSize = 6378137;
  const ref = useRef();
  const map = useTexture('earth.webp');

  return <Sphere ref={ref} name='EARTH' material-map={map} args={[earthSize, 64, 64]} />;
}
