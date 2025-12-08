import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

// Biến tạm dùng để tính toán
const tempNormal = new THREE.Vector3();
const tempView = new THREE.Vector3();
const tempTargetPos = new THREE.Vector3();

// Hằng số
const MIN_OPACITY = 0.1; // Độ mờ tối thiểu (khi ảnh ở rìa/sau lưng)
const MAX_OPACITY = 1.0; // Độ rõ tối đa (khi ảnh ở mặt tiền)

function ImageItem({ url, position }) {
  // Load texture (có cache tự động)
  const texture = useTexture(url);
  
  // Refs để truy cập trực tiếp vào đối tượng Three.js 
  const materialRef = useRef(); 
  const ref = useRef();

  // useLayoutEffect: setup mọi thứ trước khi ảnh được render
  useLayoutEffect(() => {
    if (ref.current) {
      // Set vị trí xuất hiện ở tâm
      ref.current.position.set(0, 0, 0); 
      
      // Lúc mới sinh ra -> Opacity = 1
      if (materialRef.current) {
        materialRef.current.opacity = 1.0;
        materialRef.current.transparent = true; // Bắt buộc true để có thể fade sau này
      }
    }
  }, []);

  // Lặp 60 lần/giây (tuỳ màn hình)
  // delta: Thời gian giữa các lần render
  useFrame(({ camera }, delta) => {
    // Chỉ chạy khi mesh và material đã sẵn sàng
    if (ref.current && materialRef.current) {
      // ảnh luôn quay mặt về phía camera
      ref.current.lookAt(camera.position);

      // Lấy vị trí đích từ props truyền vào
      tempTargetPos.set(...position);
      
      // Tính khoảng cách thực tế từ vị trí hiện tại đến đích
      const distToTarget = ref.current.position.distanceTo(tempTargetPos);

      // Sử dụng hàm damp (Giảm chấn lò xo) để di chuyển mượt mà
      // Lambda = 3: Độ cứng lò xo. Số càng to bay càng nhanh.
      // Delta: Thời gian trôi qua giữa 2 frame -> Giúp chuyển động đều trên mọi máy.
      const smoothX = THREE.MathUtils.damp(ref.current.position.x, tempTargetPos.x, 3, delta);
      const smoothY = THREE.MathUtils.damp(ref.current.position.y, tempTargetPos.y, 3, delta);
      const smoothZ = THREE.MathUtils.damp(ref.current.position.z, tempTargetPos.z, 3, delta);
      
      // Cập nhật vị trí mới
      ref.current.position.set(smoothX, smoothY, smoothZ);
      
      // --- C. TÍNH TOÁN OPACITY CƠ BẢN (THEO GÓC NHÌN) ---
      // Mục tiêu: Ảnh ở giữa thì rõ, ảnh ở rìa thì mờ.
      
      // Tính vector pháp tuyến (Hướng từ tâm ra ảnh)
      // Fix lỗi chia cho 0 khi ảnh đang ở đúng tâm (0,0,0)
      if (ref.current.position.lengthSq() > 0.001) {
         tempNormal.copy(ref.current.position).normalize();
      } else {
         tempNormal.set(0, 0, 1);
      }
      
      // Tính vector nhìn (Hướng từ camera vào ảnh)
      tempView.copy(camera.position).sub(ref.current.position).normalize();
      
      // Tích vô hướng (Dot Product): -1 (Sau lưng) -> 1 (Đối diện)
      const dot = tempNormal.dot(tempView);

      // Map giá trị dot sang Opacity
      // [-0.2, 0.2] -> [MIN, MAX] (Tạo độ dốc thoải, không bị gắt)
      let standardOpacity = THREE.MathUtils.mapLinear(dot, -0.2, 0.2, MIN_OPACITY, MAX_OPACITY);
      standardOpacity = THREE.MathUtils.clamp(standardOpacity, MIN_OPACITY, MAX_OPACITY);

      // --- D. LOGIC PHA TRỘN (SPAWN MIXING) - QUAN TRỌNG NHẤT ---
      // Vấn đề: Lúc mới sinh ở tâm (dot ~ 0), standardOpacity rất thấp (bị tối).
      // Giải pháp: Khi còn xa đích (đang bay), ta cưỡng ép Opacity = 1.
      
      // spawnFactor:
      // - Khoảng cách > 5m (Mới sinh): Factor = 1
      // - Khoảng cách = 0m (Đã đến nơi): Factor = 0
      const spawnFactor = THREE.MathUtils.smoothstep(distToTarget, 0, 5);
      
      // Lerp (Pha trộn):
      // - Nếu spawnFactor = 1 -> Lấy 1.0 (Rõ tuyệt đối)
      // - Nếu spawnFactor = 0 -> Lấy standardOpacity (Mờ theo quy luật dot)
      const finalOpacity = THREE.MathUtils.lerp(standardOpacity, 1.0, spawnFactor);

      // Áp dụng giá trị cuối cùng vào vật liệu (có thêm lerp thời gian 0.05 để mượt hơn)
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        finalOpacity,
        0.05
      );

      // --- E. KỸ THUẬT HÓA RẮN (SOLIDIFY) ---
      // Mục tiêu: Fix lỗi "nhìn xuyên thấu" (Depth Sorting) của WebGL.
      // Khi ảnh đã đến nơi (dist < 0.5) VÀ đủ rõ (> 0.99), ta tắt chế độ trong suốt.
      const isArrived = distToTarget < 0.5;
      const isOpaque = materialRef.current.opacity >= 0.99 && isArrived;

      // Chỉ cập nhật khi trạng thái thay đổi để tiết kiệm CPU
      if (materialRef.current.transparent === isOpaque) {
        materialRef.current.transparent = !isOpaque; // Đảo ngược: Opaque -> transparent = false
        materialRef.current.needsUpdate = true; // Báo cho Three.js compile lại shader
      }
      
      // Tối ưu GPU: Nếu quá mờ, ẩn luôn mesh khỏi quy trình vẽ
      ref.current.visible = materialRef.current.opacity > 0.01;
    }
  });

  return (
    <mesh ref={ref}> 
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        ref={materialRef}
        transparent={true} // Khởi tạo là true để có thể fade lúc đầu
      />
    </mesh>
  );
}

export default ImageItem;