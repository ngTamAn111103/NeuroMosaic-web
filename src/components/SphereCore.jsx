// Components này giải quyết vấn đề cho:
// args={[radius * 0.98, 32, 32]}.
// => React sẽ phải hủy và tạo lại hoàn toàn

// Làm cách này thì chỉ cần tạo ra quả cầu R=1 -> Scale lên
import React, { useRef } from "react";

const SphereCore = ({ radius }) => {
  const ref = useRef();

  return (
    <mesh
      ref={ref}
      position={[0, 0, 0]}
      // 🔥 TỐI ƯU: Dùng scale thay vì đổi args
      // radius * 0.98: Để nó nằm lọt thỏm bên trong ảnh, không bị cắt nét
      scale={[radius * 0.98, radius * 0.98, radius * 0.98]}
    >
      {/* Khởi tạo cầu chuẩn bán kính = 1 */}
      <sphereGeometry args={[1, 32, 32]} />

      <meshBasicMaterial
        color="#4ea8de" // Màu xanh công nghệ
        wireframe={true}
        transparent={true}
        opacity={0.15} // Mờ thôi để không tranh chấp với ảnh
      />
    </mesh>
  );
};

export default SphereCore;
