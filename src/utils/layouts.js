import * as THREE from "three";

/**
 * Tính toán vị trí cho Layout hình tròn (Circle)
 * @param {Array} images - Danh sách dữ liệu ảnh gốc
 * @param {number} radius - Bán kính vòng tròn
 * @returns {Array} - Danh sách ảnh mới kèm position [x, y, z] và rotation [x, y, z]
 */
export const getCircleLayout = (images, radius = 10) => {
  const total = images.length;
  // Góc giữa các ảnh (tính bằng radian)
  const angleStep = (2 * Math.PI) / total;

  return images.map((img, i) => {
    // 1. Tính góc theta cho ảnh thứ i
    // Bạn có thể cộng thêm Math.PI nếu muốn điểm bắt đầu ở vị trí khác
    const theta = i * angleStep;

    // 2. Tính toạ độ (Theo công thức bạn yêu cầu)
    // Trục Y = 0 để ảnh nằm trên mặt phẳng ngang
    const x = radius * Math.cos(theta);
    const y = 0;
    const z = radius * Math.sin(theta);

    return {
      ...img,
      // Trả về mảng toạ độ chuẩn Three.js
      position: [x, y, z],
    };
  });
};

/**
 * (Gợi ý) Layout hình cầu Fibonacci - Bạn có thể dùng sau này
 */
export const getSphereLayout = (images, radius = 10) => {
  const total = images.length;
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden Angle

  return images.map((img, i) => {
    const y = 1 - (i / (total - 1)) * 2; // y đi từ 1 xuống -1
    const radiusAtY = Math.sqrt(1 - y * y); // Bán kính tại lát cắt y
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    // Vector hướng từ tâm ra vật thể (để tính rotation lookAt)
    const position = new THREE.Vector3(x * radius, y * radius, z * radius);

    // Tính rotation sao cho ảnh nhìn vào tâm (LookAt center)
    // Đây là logic giả lập, trong R3F bạn có thể dùng <Billboard> hoặc lookAt()
    const dummyObj = new THREE.Object3D();
    dummyObj.position.copy(position);
    dummyObj.lookAt(0, 0, 0);

    return {
      ...img,
      position: [position.x, position.y, position.z],
      rotation: [dummyObj.rotation.x, dummyObj.rotation.y, dummyObj.rotation.z],
    };
  });
};
