import { Sphere, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

useTexture.preload('/earth.webp');

export default function Earth() {
  const earthSize = 6378137;
  const ref = useRef();
  const map = useTexture('/earth.webp');

  useFrame(({ clock }) => {
    if (ref.current) {
      const dt = clock.getDelta();
      ref.current.rotation.x += dt * 0.00007292115; // Earth's rotation rate in radians per second
    }
  });

  return <Sphere ref={ref} name='EARTH' material-map={map} args={[earthSize, 64, 64]} />;
}
