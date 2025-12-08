import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

// Biến tạm để tính tích vô hướng
const tempNormal = new THREE.Vector3();
const tempView = new THREE.Vector3();

function ImageItem({ url, position }) {
  // Tải ảnh và biến thành Texture -> dán lên mesh
  // useTexture có cơ chế cache, giúp tránh load trùng -> Thích hợp tương lai làm tính năng số lượng ảnh ít hơn thực tế
  const texture = useTexture(url);
  const materialRef = useRef();
  const ref = useRef();
  // Chạy 60 lần mỗi giây
  useFrame(({ camera }) => {
    if (ref.current && materialRef.current) {
      // Ra lệnh cho vật thể "Nhìn vào" vị trí của camera
      ref.current.lookAt(camera.position);

      // --- Tích vô hướng giữa ảnh và camera ---
      // Vector của ảnh so với tâm
      tempNormal.copy(ref.current.position).normalize();
      // Vector của camera so với tâm
      tempView.copy(camera.position).sub(ref.current.position).normalize();

      // Tích vô hướng 2 vector
      const dot = tempNormal.dot(tempView);

      // Dựa vào dot chạy từ -1 đến 1
      const targetOpacity = dot < 0 ? 0.1 : 1;

      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        0.05,
      );
    }
  });
  return (
    // mesh (Hình dạng) = geometry(kích thước) + material (nội dung)
    <mesh position={position} ref={ref}>
      <planeGeometry args={[1, 1]} />
      {/* toneMapped={false}: không bị “wash out”. */}
      <meshBasicMaterial 
      map={texture} 
      ref={materialRef}
      transparent={true} // Bật để opacity

      />
    </mesh>
  );
}

export default ImageItem;
