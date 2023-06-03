'use client';

import { Instance, useBounds } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import { Quaternion, Vector3 } from 'three';

export default function Airplane({ hex, lat, lng, alt, dir, speed, v_speed, model, showPlaneInfo, setShowPlaneInfo, setTarget }) {
  const ref = useRef();
  const modifier = 100000;
  const bounds = useBounds();

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
  const getNewRotation = useCallback((latitude, longitude, altitude, horizontalSpeed, verticalSpeed, direction) => {
    // Convert direction from degrees to radians
    const directionRad = (direction * Math.PI) / 180;

    // Calculate the heading orientation
    const headingQuaternion = new Quaternion();
    headingQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), directionRad);

    // Calculate the pitch orientation
    const pitchQuaternion = new Quaternion();
    const pitchRad = Math.atan2(verticalSpeed, horizontalSpeed);
    pitchQuaternion.setFromAxisAngle(new Vector3(1, 0, 0), pitchRad);

    // Convert latitude and longitude to Earth-centered coordinates
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;
    const earthRadius = 6371000; // Earth's radius in meters
    const x = (earthRadius + altitude) * Math.cos(latRad) * Math.cos(lonRad);
    const y = (earthRadius + altitude) * Math.sin(latRad);
    const z = (earthRadius + altitude) * Math.cos(latRad) * Math.sin(lonRad);

    // Create a quaternion from the Earth-centered coordinates
    const positionQuaternion = new Quaternion();
    positionQuaternion.setFromAxisAngle(new Vector3(x, y, z).normalize(), 0);

    // Combine the position, heading, and pitch quaternions to get the final orientation
    const quaternion = new Quaternion();
    quaternion.multiplyQuaternions(positionQuaternion, headingQuaternion);
    quaternion.multiply(pitchQuaternion);
    return quaternion;
  }, []);
  const positionToVector3 = useCallback((_alt, _lat, _lng) => {
    const alt_in_km = _alt + 6378137;
    const x = Math.cos(_lat) * Math.cos(_lng) * alt_in_km,
      y = Math.cos(_lat) * Math.sin(_lng) * alt_in_km,
      z = Math.sin(_lat) * alt_in_km;

    return new Vector3(x, y, z);
  }, []);
  const onPlaneClick = useCallback(
    (e) => {
      e.stopPropagation();

      setShowPlaneInfo({
        hex,
        lat,
        lng,
        alt,
        speed,
        v_speed
      });
    },
    [setShowPlaneInfo, hex, lat, lng, alt, speed, v_speed]
  );

  const position = positionToVector3(alt, lat, lng);

  // On plane click, zoom in to it
  useEffect(() => {
    if (model && ref.current) {
      bounds.refresh(ref.current).clip().fit();
      setTarget(ref.current.position);
    }
  }, [bounds, model, setTarget]);

  // Addjust position based on horizontal and vertical speed
  useFrame(() => {
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

  // Adjust rotation based on speeds and direction
  useFrame(() => {
    if (ref.current) {
      const newRot = getNewRotation(
        ref.current.userData?.lat || lat,
        ref.current.userData?.lng || lng,
        ref.current.userData?.alt || alt,
        ref.current.userData?.speed || speed,
        ref.current.userData?.v_speed || v_speed,
        ref.current.userData?.dir || dir
      );

      ref.current.setRotationFromQuaternion(newRot);
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      userData={{
        hex,
        lat,
        lng,
        alt,
        dir,
        speed,
        v_speed
      }}
    >
      <Instance scale={model ? 0 : 1 * modifier} onClick={onPlaneClick} />
      {model ? <primitive object={model} scale={3 * modifier} /> : null}
    </group>
  );
}
