import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

const CameraRig = ({ radius, controlsRef }) => {
  // Khởi tạo danh sách trạng thái
  const state = useRef({
    prevRadius: radius, // Lưu bán kính cũ để so sánh
    isAutoAdjusting: false, // Camera có đang tự chạy không?
  });

  // Chạy liên tục để kiểm tra
  // delta: Thời gian trôi qua kể từ khung hình trước
  useFrame((rootState, delta) => {
    const camera = rootState.camera; // Lấy camera từ Three.js
    const internalState = state.current; // Lấy trạng thái nội bộ

    // Kiểm tra bán kính có thay đổi so với trước đây không
    // 0.05: tránh lỗi thập phân nhỏ
    if (Math.abs(radius - internalState.prevRadius) > 0.05) {
      // Cập nhật lại radius mới
      internalState.prevRadius = radius;
      // Bật cờ: hệ thống đang tự di chuyển camera -> Khoá zoom bằng chuột
      internalState.isAutoAdjusting = true;

      // KHÓA ZOOM NGAY LẬP TỨC
      if (controlsRef.current) {
        controlsRef.current.enableZoom = false;
      }
    }

    // Đích đến của camera = Radius + 0 + (Căn bậc 2 của Radius * 2)
    // Giúp camera lùi xa nhưng không lùi quá đà khi số lượng ảnh cực lớn
    // + 0: Tăng giảm để camera xa gần thêm (Mặc định ko cần)
    let targetDistance = radius + 0 + Math.sqrt(radius) * 2;

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
