import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

function ImageItem({ url, position }) {
  // Tải ảnh và biến thành Texture -> dán lên mesh
  // useTexture có cơ chế cache, giúp tránh load trùng -> Thích hợp tương lai làm tính năng số lượng ảnh ít hơn thực tế
  const texture = useTexture(url);

  const ref = useRef();
  // Chạy 60 lần mỗi giây
  useFrame(({ camera }) => {
    if (ref.current) {
      // Ra lệnh cho vật thể "Nhìn vào" vị trí của camera
      ref.current.lookAt(camera.position);
    }
  });
  return (
    // mesh (Hình dạng) = geometry(kích thước) + material (nội dung)
    <mesh position={position} ref={ref}>
      <planeGeometry args={[1, 1]} />
      {/* toneMapped={false}: không bị “wash out”. */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default ImageItem;
