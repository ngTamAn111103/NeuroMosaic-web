import { Suspense, useMemo, useState, useRef, useTransition } from "react";
// Canvas
import { Canvas, useLoader } from "@react-three/fiber";
import { MeshBasicMaterial, SphereGeometry, TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";

// Data ảnh
import data_images from "./data_images.json";

// Components
import ImageItem from "./components/ImageItem";
import UIOverlay from "./components/UIOverlay";
import CameraRig from "./components/CameraRig"; // Hoặc để chung file
import SphereCore from "./components/SphereCore"; // Cầu lưới cho mode Sphere
import CameraResetter from "./components/CameraResetter"; // Camera tốc biến về initialCameraPosition khi đổi mode
// Hàm tính toán
import { getCircleLayout, getSphereLayout } from "./utils/layouts";
// Cấu hình từng mode
import { LAYOUT_CONFIGS } from "./utils/layoutConfigs";

function App() {
  // useState
  const [imageCount, setImageCount] = useState(20);
  const [layout, setLayout] = useState("sphere");
  // useTransition
  // cho biết có đang chờ tải không (để hiện loading icon nếu muốn)
  const [isPending, startTransition] = useTransition();

  // Lấy config cho mode hiện tại
  const config = LAYOUT_CONFIGS[layout];
  // useRef
  // Tạo Ref để nắm đầu OrbitControls -> Nếu đang di chuyển camera do R tăng => Khoá zoom
  const controlsRef = useRef();

  // useMemo
  // Tính bán kính dựa trên số lượng ảnh
  const radius = useMemo(() => {
    if (layout === "sphere") {
      return Math.sqrt(imageCount) / 2;
    }
    if (layout === "circle") {
      return imageCount * 0.3;
    }
    return imageCount * 0.15;
  }, [imageCount, layout]);

  // tính vị trí của từng ảnh dựa trên số lượng và bán kính
  const visibleImages = useMemo(() => {
    // Cắt số lượng ảnh vừa đủ
    const subset = data_images.slice(0, imageCount);

    // Chuyển đổi mode
    switch (layout) {
      case "circle":
        return getCircleLayout(subset, radius);
      case "sphere":
        return getSphereLayout(subset, radius);
      default:
        return getCircleLayout(subset, radius);
    }
  }, [imageCount, layout, radius]); // Chạy lại khi 2 biến này đổi

  // Hàm này sẽ đánh dấu việc đổi số lượng ảnh là "Transition" (Ưu tiên thấp)
  const handleSetImageCount = (value) => {
    startTransition(() => {
      setImageCount(value);
    });
  };
  return (
    <div className="relative h-screen w-full bg-black">
      {/* UI Overlay */}
      <UIOverlay
        currentLayout={layout}
        setLayout={setLayout}
        imageCount={imageCount}
        setImsetImageCount={handleSetImageCount}
        max={Math.min(200, data_images.length)} // hiển thị tối đa 200 ảnh thôi, đỡ lag
      />
      {/* Thế giới 3D */}
      <Canvas
        camera={{
          position: config.initialCameraPosition,
          fov: config.fov,
        }}
      >
        {/* Ánh sáng (0/1: Tối/Sáng) */}
        <ambientLight intensity={1} />

        {/* Camera lùi lại khi tăng số lượng ảnh */}
        <CameraRig
          radius={radius}
          controlsRef={controlsRef}
          mode={config.rigMode}
        />
        {/* Tự động reset góc nhìn khi đổi mode  */}
        <CameraResetter
          position={config.initialCameraPosition}
          controlsRef={controlsRef}
        />

        {/* Để lõi cầu riêng với ảnh */}
        <Suspense fallback={null}>
          {layout === "sphere" && <SphereCore radius={radius} />}
        </Suspense>

        {visibleImages.map((img) => (
          // 🔥 QUAN TRỌNG: Key nằm ở Suspense ngoài cùng
          <Suspense key={img.id} fallback={null}>
            <ImageItem
              url={img.thumbnail}
              position={img.position}
              layout={layout}
              mode={layout} // Truyền đúng tên prop bên ImageItem (lúc nãy ta đặt là mode)
              doubleSide={config.doubleSide}
            />
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
          ref={controlsRef}
          autoRotate
          rotateSpeed={config.rotateSpeed}
          // minDistance={19}
          // maxDistance={21}
        />
      </Canvas>
    </div>
  );
}

export default App;
