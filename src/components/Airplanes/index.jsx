'use client';

import { Instances, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Airplane from './Airplane';

useGLTF.preload('/airplane.glb');

export default function Airplanes({ setTarget }) {
  const { scene } = useGLTF('/airplane.glb');
  const [airplaneData, setAirplaneData] = useState([]);
  const [showPlaneInfo, setShowPlaneInfo] = useState();

  const shortenedAirplaneData = useMemo(() => airplaneData.slice(0, 10), [airplaneData]);
  const material = useMemo(() => {}, []);
  const geometry = useMemo(() => {}, []);

  useEffect(() => {
    if (localStorage.getItem('airplaneData')) {
      setAirplaneData(JSON.parse(localStorage.getItem('airplaneData')));
      return;
    }

    const fields = 'hex,lat,lng,alt,dir,speed,v_speed,';
    const getAirplaneData = fetch(
      `https://airlabs.co/api/v9/flights?api_key=${process.env.NEXT_PUBLIC_API_KEY}&_fields=${fields}`
    );
    Promise.resolve(getAirplaneData)
      .then((response) => {
        return response.json();
      })
      .then(({ response }) => {
        setAirplaneData(response);
        localStorage.setItem('airplaneData', JSON.stringify(response));
      });
  }, []);

  return (
    <Suspense>
      <Instances>
        <boxGeometry />
        <meshStandardMaterial color='red' />

        {airplaneData.map((airplane) => {
          return (
            <Airplane
              key={airplane.hex}
              {...airplane}
              model={showPlaneInfo?.hex === airplane.hex ? scene : null}
              showPlaneInfo={showPlaneInfo}
              setShowPlaneInfo={setShowPlaneInfo}
              setTarget={setTarget}
            />
          );
        })}
      </Instances>
    </Suspense>
  );
}
