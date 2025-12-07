import { Suspense, useState } from "react";
// Canvas
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";

// Data ảnh
import data_images from "./data_images.json";

// Components
import ImageItem from "./components/ImageItem";
import UIOverlay from "./components/UIOverlay";

function App() {
  return (
    <div className="relative h-screen w-full bg-black">
      {/* UI Overlay */}
      <UIOverlay />
      {/* Thế giới 3D */}
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        {/* Ánh sáng (0/1: Tối/Sáng) */}
        <ambientLight intensity={1} />

        {data_images.map((img) => (
          <Suspense key={img.id} fallback={null}>
            <ImageItem url={img.thumbnail} position={img.position} />
          </Suspense>
        ))}

        {/* Camera điều khiển chuột */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={19}
          maxDistance={21}
        />
      </Canvas>
    </div>
  );
}

export default App;
