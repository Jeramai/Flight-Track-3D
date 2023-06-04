'use client';

import { Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import { Vector3 } from 'three';

export default function Airplane({ setPlaneInfo, hex, lat, lng, alt, speed, v_speed, dep_iata }) {
  const ref = useRef();
  const modifier = 100000;

  const getNewPosition = useCallback((_lat, _lng, _alt, horizontalSpeed, verticalSpeed) => {
    const speedModifier = modifier * 1000; // x1000 from m/s to km/h
    const newLat = _lat + (horizontalSpeed * Math.cos((_alt * Math.PI) / 180)) / speedModifier;
    const newLng = _lng + (horizontalSpeed * Math.sin((_alt * Math.PI) / 180)) / speedModifier;
    const newAlt = _alt + verticalSpeed / speedModifier;

    return {
      lat: newLat,
      lng: newLng,
      alt: newAlt
    };
  }, []);
  const positionToVector3 = useCallback((_alt, _lat, _lng) => {
    const alt_in_km = _alt * 10 + 6378137;
    const x = Math.cos(degreesToRadians(_lat)) * Math.cos(degreesToRadians(_lng)) * alt_in_km,
      y = Math.cos(degreesToRadians(_lat)) * Math.sin(degreesToRadians(_lng)) * alt_in_km,
      z = Math.sin(degreesToRadians(_lat)) * alt_in_km;

    return new Vector3(x, y, z);
  }, []);
  const onClick = useCallback(() => {
    setPlaneInfo({
      hex,
      dep_iata
    });
  }, [dep_iata, hex, setPlaneInfo]);

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
      scale={1 * modifier}
      position={position}
      userData={{
        lat: lat,
        lng: lng,
        alt: alt,
        speed: speed,
        v_speed: v_speed
      }}
      // onClick={onClick}
    />
  );
}

export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
