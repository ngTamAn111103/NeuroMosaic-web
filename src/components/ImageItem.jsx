import { useTexture } from "@react-three/drei";
import React from "react";

function ImageItem({ url, position }) {
  // Tải ảnh và biến thành Texture -> dán lên mesh
  // useTexture có cơ chế cache, giúp tránh load trùng -> Thích hợp tương lai làm tính năng số lượng ảnh ít hơn thực tế
  const texture = useTexture(url);
  return (
    // mesh (Hình dạng) = geometry(kích thước) + material (nội dung)
    <mesh position={position}>
      <planeGeometry args={[1, 1]} />
      {/* toneMapped={false}: không bị “wash out”. */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default ImageItem;
