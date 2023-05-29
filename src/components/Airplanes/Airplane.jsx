'use client';

import { Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';

export default function Airplane({ lat, lng, alt, speed, v_speed }) {
  const ref = useRef();

  const position = useMemo(() => {
    const alt_in_m = alt / 1000;
    const x = Math.cos(lat) * Math.cos(lng) * alt_in_m,
      y = Math.cos(lat) * Math.sin(lng) * alt_in_m,
      z = Math.sin(lat) * alt_in_m;

    return new Vector3(x, y, z);
  }, [alt, lat, lng]);

  useFrame(() => {
    // Addjust position based on horizontal and vertical speed
  });

  return <Instance ref={ref} position={position} scale={0.05} />;
}
