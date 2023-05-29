"use client"

import Airplanes from '@/components/Airplanes'
import { OrbitControls, Sphere, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export default function Home() {
  const earthSize = 0.6371000

  return (
    <main className="w-screen h-screen">
      <Canvas>
        <Stage>
          <Sphere name='EARTH' scale={earthSize} material-color='blue' />

          <Airplanes />
        </Stage>

        <OrbitControls />
      </Canvas>
    </main>
  )
}
