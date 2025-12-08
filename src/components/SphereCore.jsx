// Components này giải quyết vấn đề cho:
// args={[radius * 0.98, 32, 32]}.
// => React sẽ phải hủy và tạo lại hoàn toàn
// Làm cách này thì chỉ cần tạo ra quả cầu R=1 -> Scale lên
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

const SphereCore = ({ radius }) => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      // 1. Xác định đích đến (Target Scale)
      // radius * 0.98 để nằm lọt bên trong ảnh
      const targetScale = radius * 0.98;

      // 2. Lấy kích thước hiện tại (Current Scale)
      // Vì là hình cầu nên x = y = z, ta chỉ cần lấy 1 trục để tính toán
      const currentScale = ref.current.scale.x;

      // 3. Dùng hàm damp để co giãn mượt mà
      // Lambda = 4: Độ đàn hồi vừa phải.
      const smoothScale = THREE.MathUtils.damp(
        currentScale,
        targetScale,
        4, 
        delta
      );

      // 4. Áp dụng lại cho cả 3 trục
      ref.current.scale.set(smoothScale, smoothScale, smoothScale);
    }
  });

  return (
    <mesh
      ref={ref}
      position={[0, 0, 0]}
    >
      {/* Khởi tạo cầu chuẩn bán kính = 1 */}
      <sphereGeometry args={[1, 32, 32]} />

      <meshBasicMaterial
        color="#4ea8de"
        wireframe={true}
        transparent={true}
        opacity={0.15}
      />
    </mesh>
  );
};

export default SphereCore;