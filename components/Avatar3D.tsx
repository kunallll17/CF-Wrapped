import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const AvatarModel = () => {
  // Using a default 3D model - replace with your preferred model
  const gltf = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/avatar-bot/model.gltf');
  return <primitive object={gltf.scene} position={[0, -1, 0]} scale={1.5} />;
};

const Avatar3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <AvatarModel />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        autoRotate
      />
    </Canvas>
  );
};

export default Avatar3D; 