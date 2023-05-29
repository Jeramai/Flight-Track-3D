"use client"

import Airplanes from '@/components/Airplanes'
import Earth from '@/components/Earth'
import { OrbitControls, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export default function Home() {

  return (
    <main className="w-screen h-screen">
      <Canvas>
        <Stage>
          <Earth />

          <Airplanes />
        </Stage>

        <OrbitControls />
      </Canvas>
    </main>
  )
}
