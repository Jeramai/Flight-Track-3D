'use client';

import { Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import { Vector3 } from 'three';

export default function Airplane({ lat, lng, alt, speed, v_speed }) {
  const ref = useRef();

  const getNewPosition = useCallback((_lat, _lng, _alt, horizontalSpeed, verticalSpeed) => {
    const newLat = _lat + horizontalSpeed * Math.cos((_alt * Math.PI) / 180) * 0.000001;
    const newLng = _lng + horizontalSpeed * Math.sin((_alt * Math.PI) / 180) * 0.000001;
    const newAlt = _alt + verticalSpeed * 0.000001;

    return {
      lat: newLat,
      lng: newLng,
      alt: newAlt
    };
  }, []);
  const positionToVector3 = useCallback((_alt, _lat, _lng) => {
    const alt_in_m = _alt / 1000;
    const x = Math.cos(_lat) * Math.cos(_lng) * alt_in_m,
      y = Math.cos(_lat) * Math.sin(_lng) * alt_in_m,
      z = Math.sin(_lat) * alt_in_m;

    return new Vector3(x, y, z);
  }, []);

  const position = positionToVector3(alt, lat, lng);

  useFrame(() => {
    // Addjust position based on horizontal and vertical speed
    if (ref.current) {
      const newPos = getNewPosition(
        ref.current.userData?.lat || lat,
        ref.current.userData?.lng || lng,
        ref.current.userData?.alt || alt,
        speed,
        v_speed
      );

      ref.current.userData.lat = newPos.lat;
      ref.current.userData.lng = newPos.lng;
      ref.current.userData.alt = newPos.alt;
      ref.current.position.copy(positionToVector3(newPos.alt, newPos.lat, newPos.lng));
    }
  });

  return (
    <Instance
      ref={ref}
      scale={0.05}
      position={position}
      userDate={{
        lat: lat,
        lng: lng,
        alt: alt,
        speed: speed,
        v_speed: v_speed
      }}
    />
  );
}
