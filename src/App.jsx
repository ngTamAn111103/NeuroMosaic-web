import { useState } from "react";
// Canvas
import { Canvas, useLoader } from "@react-three/fiber";

// Data ảnh
import data_images from "./data_images.json";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";

function App() {
  const ImageItem = ({ url, position }) => {
    // Tải ảnh và biến thành Texture -> dán lên mesh
    const texture = useLoader(TextureLoader, url);
    return (
      <mesh position={position}>
        {/* Hình dạng */}
        <planeGeometry args={[2, 2]} />
        {/* toneMapped={false}: không bị “wash out”. */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    );
  };

  return (
    <div className="relative h-screen w-full bg-black">
      {/* UI Overlay */}
      <h1 className="absolute top-5 left-5 z-10 bg-white">
        {/* Tên dự án */}
        <div className="">
          <h1 className="bg-linear-to-r from-cyan-400 to-purple-500 text-3xl font-bold">
            NEUROMOSAIC
          </h1>
        </div>
      </h1>

      {/* Thế giới 3D */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Ánh sáng (0/1: Tối/Sáng) */}
        <ambientLight intensity={1} />
        {/* // mesh = geometry + material */}
        {data_images.map((img) => (
          <ImageItem key={img.id} url={img.thumbnail} position={img.position} />
        ))}
        {/* Camera điều khiển chuột */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
