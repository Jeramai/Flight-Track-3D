'use client';

import { Instances } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import Airplane from './Airplane';

export default function Airplanes() {
  const [airplaneData, setAirplaneData] = useState([]);

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
      .then(({ response, error }) => {
        if (response) {
          setAirplaneData(response);
          localStorage.setItem('airplaneData', JSON.stringify(response));
        } else if (error) {
          console.error(error.message);
        }
      });
  }, []);

  return (
    <Suspense>
      <Instances>
        <boxGeometry />
        <meshStandardMaterial color='red' />

        {airplaneData.map((airplane) => {
          return <Airplane key={airplane.hex} {...airplane} />;
        })}
      </Instances>
    </Suspense>
  );
}
