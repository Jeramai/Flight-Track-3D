"use client"

import Airplanes from '@/components/Airplanes'
import Earth from '@/components/Earth'
import { OrbitControls, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { Vector3 } from 'three'

export default function Home() {
  const [target, setTarget] = useState(new Vector3())

  return (
    <main className="w-screen h-screen">
      <Canvas>
        <Stage fit clip observe damping={6} margin={1.2} files='/environment.hdr'>
          <Earth setTarget={setTarget} />

          <Airplanes setTarget={setTarget} />
        </Stage>

        <OrbitControls target={target} />
      </Canvas>
    </main>
  )
}
