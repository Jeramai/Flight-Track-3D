"use client"

import AirplaneInfoBox from '@/components/AirplaneInfoBox'
import Airplanes from '@/components/Airplanes'
import Earth from '@/components/Earth'
import { OrbitControls, Stage, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'

export default function Home() {
  const [planeInfo, setPlaneInfo] = useState()

  return (
    <main className="w-screen h-screen">
      <Canvas>
        <Stage>
          <Earth />

          <Airplanes setPlaneInfo={setPlaneInfo} />
        </Stage>

        <OrbitControls />
        <Stats />
      </Canvas>

      <AirplaneInfoBox {...planeInfo} />
    </main>
  )
}
