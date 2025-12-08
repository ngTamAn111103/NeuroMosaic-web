// Nhiệm vụ duy nhất, khi mode thay đổi:
// cho camera về đúng initialCameraPosition trong config
// Tốc biến về luôn chứ không damp về từ từ
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const CameraResetter = ({ position, controlsRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    // Logic: Khi "position" (từ config) thay đổi -> Reset camera ngay lập tức
    
    // 1. Đặt lại vị trí Camera
    camera.position.set(...position);

    // 2. Quan trọng: Reset tiêu điểm của OrbitControls về (0,0,0)
    // Nếu người dùng đã Pan chuột đi chỗ khác, ta cần kéo họ về tâm
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update(); // Bắt buộc gọi để áp dụng thay đổi
    }
    
    // 3. Reset hướng nhìn của camera về tâm (đề phòng)
    camera.lookAt(0, 0, 0);

  }, [position, camera, controlsRef]); // Chỉ chạy khi Position Config thay đổi

  return null;
};

export default CameraResetter;