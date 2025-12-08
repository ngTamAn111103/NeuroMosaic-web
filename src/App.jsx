import { Suspense, useMemo, useState } from "react";
// Canvas
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";

// Data ảnh
import data_images from "./data_images.json";

// Components
import ImageItem from "./components/ImageItem";
import UIOverlay from "./components/UIOverlay";

// Hàm tính toán
import { getCircleLayout } from "./utils/layouts";

function App() {
  // useState
  const [imageCount, setImageCount] = useState(20);
  const [layout, setLayout] = useState("circle");
  const [radius, setRadius] = useState(12);

  // useMemo
  const visibleImages = useMemo(() => {
    const subset = data_images.slice(0, imageCount);
    switch (layout) {
      case "circle":
        return getCircleLayout(subset, radius);
      
      default:
        return getCircleLayout(subset, radius);
    }
  }, [imageCount, layout]); // Chạy lại khi 2 biến này đổi

  return (
    <div className="relative h-screen w-full bg-black">
      {/* UI Overlay */}
      <UIOverlay
        currentLayout={layout}
        setLayout={setLayout}
        imageCount={imageCount}
        setImageCount={setImageCount}
        max={data_images.length}
      />
      {/* Thế giới 3D */}
      <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
        {/* Ánh sáng (0/1: Tối/Sáng) */}
        <ambientLight intensity={1} />

        {visibleImages.map((img) => (
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
