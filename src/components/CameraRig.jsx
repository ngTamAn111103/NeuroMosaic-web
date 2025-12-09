// Dựa vào radius và tự đoonjg đẩy máy quay ra xa hoặc kéo lại gần
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

// radius: bán kính Radius
// controlsRef: Điều khiển OrbitControl
// mode: Mode layout
const CameraRig = ({ radius, controlsRef, mode = "C" }) => {
  // Khởi tạo danh sách trạng thái
  const state = useRef({
    prevRadius: null, // Lưu bán kính của khung hình trước
    isAutoAdjusting: false, // Camera có đang tự chạy không?
  });

  // Chạy liên tục để kiểm tra
  // delta: Thời gian trôi qua kể từ khung hình trước
  useFrame((rootState, delta) => {
    const camera = rootState.camera; // Lấy camera từ Three.js
    const internalState = state.current; // Lấy trạng thái nội bộ

    // Nếu lần đầu tiên chạy - null
    // Radius thay đổi > 0.05 (tránh lỗi số thập phân nhỏ)
    if (
      internalState.prevRadius === null ||
      Math.abs(radius - internalState.prevRadius) > 0.05
    ) {
      // Cập nhật lại radius mới
      internalState.prevRadius = radius;
      // Bật cờ: hệ thống đang tự di chuyển camera -> Khoá zoom bằng chuột
      internalState.isAutoAdjusting = true;

      // Khoá zoom orbitcontrol
      if (controlsRef.current) {
        controlsRef.current.enableZoom = false;
      }
    }

    // Khởi tạo mặc định
    let targetDistance = 0;

    if (mode === "A") {
      // --- MODE A (Dành cho Sphere) ---
      const fovRad = (camera.fov * Math.PI) / 180;
      targetDistance = radius / Math.sin(fovRad / 2);
    } else {
      // --- MODE C (Dành cho Circle) ---
      // + 0: Tăng giảm để camera xa gần thêm (Mặc định ko cần)
      targetDistance = radius + 0 + Math.sqrt(radius) * 2;
    }

    // Đang ở chế độ tự động di chuyển
    if (internalState.isAutoAdjusting) {
      // Lấy vector độ dài của camera hiện tại so với tâm
      const currentDistance = camera.position.length();

      // Kiểm tra: Đã đến nơi chưa? (Sai số < 0.1 mét)
      if (Math.abs(targetDistance - currentDistance) < 0.1) {
        // ĐÃ ĐẾN ĐÍCH:
        internalState.isAutoAdjusting = false; // Tắt cờ hiệu

        // TRẢ QUYỀN ZOOM CHO NGƯỜI DÙNG
        if (controlsRef.current) {
          controlsRef.current.enableZoom = true;
        }
      } else {
        // CHƯA ĐẾN ĐÍCH: Tiếp tục di chuyển
        // Dùng hàm damp để tạo hiệu ứng lò xo mượt mà
        const smoothDistance = THREE.MathUtils.damp(
          currentDistance, // Vị trí hiện tại
          targetDistance, // Vị trí muốn tới
          2.5, // Độ căng lò xo (Càng to càng nhanh)
          delta, // Thời gian trôi qua giữa 2 frame => Coi như độ dài giữa các step di chuyển camera
        );

        // Cập nhật vị trí mới cho camera
        // setLength: Chỉ kéo camera ra xa/gần lại, TUYỆT ĐỐI GIỮ NGUYÊN GÓC XOAY
        camera.position.setLength(smoothDistance);
      }
    }
  });

  return null; // Component này chỉ xử lý logic, không vẽ gì ra màn hình
};

export default CameraRig;
