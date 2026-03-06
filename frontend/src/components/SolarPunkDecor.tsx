import { useRef } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'

export function WindTurbine({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const bladesRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z = clock.getElapsedTime() * 1.5
    }
  })

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 2.0, 6]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.0, 0.05]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.3} />
      </mesh>
      <group ref={bladesRef} position={[0, 2.0, 0.1]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]}>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.06, 0.8, 0.01]} />
              <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

export function SolarPanel({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.3, 4]} />
        <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.02, 0.35]} />
        <meshStandardMaterial color="#1a237e" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  )
}

export function GardenBed({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.6, 0.16, 0.4]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.56, 0.04, 0.36]} />
        <meshStandardMaterial color="#3a8a3a" roughness={0.8} />
      </mesh>
      {([-0.15, 0, 0.15] as const).map((x, i) => (
        <mesh key={i} position={[x, 0.24, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial
            color={['#ff6b8a', '#ffd54f', '#ff9a5c'][i]}
            emissive={['#ff6b8a', '#ffd54f', '#ff9a5c'][i]}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 1.2, 6]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ffd54f"
          emissive="#ffd54f"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight position={[0, 1.25, 0]} color="#ffd54f" intensity={0.3} distance={3} />
    </group>
  )
}
