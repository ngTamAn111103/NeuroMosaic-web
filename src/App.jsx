import { Suspense, useMemo, useState } from "react";
// Canvas
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";

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
    // Cắt số lượng ảnh vừa đủ
    const subset = data_images.slice(0, imageCount);

    // Chuyển đổi mode
    switch (layout) {
      case "circle":
        return getCircleLayout(subset, radius);
      default:
        return getCircleLayout(subset, radius);
    }
  }, [imageCount, layout, radius]); // Chạy lại khi 2 biến này đổi

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

        {/* Chỉ render dựa trên số lượng ảnh đang chọn */}
        {visibleImages.map((img) => (
          <Suspense key={img.id} fallback={null}>
            <ImageItem url={img.thumbnail} position={img.position} />
          </Suspense>
        ))}

        <Stars
            radius={100}
            depth={100}
            count={3000}
            factor={3}
            saturation={1}
            fade
            speed={0.5}
          />

        {/* Camera điều khiển chuột */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          autoRotate
          rotateSpeed={0.1}
          minDistance={19}
          maxDistance={21}
        />
      </Canvas>
    </div>
  );
}

export default App;
