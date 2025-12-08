import * as THREE from "three";

/**
 * Tính toán vị trí cho Layout hình tròn (Circle)
 * @param {Array} images - Danh sách dữ liệu ảnh gốc
 * @param {number} radius - Bán kính vòng tròn
 * @returns {Array} - Danh sách ảnh mới kèm position [x, y, z] và rotation [x, y, z]
 */
export const getCircleLayout = (images, radius = 10) => {
  const total = images.length;
  const angleStep = (2 * Math.PI) / total;

  // 🔥 TÍNH GÓC BÙ (OFFSET)
  // Mục tiêu: Ảnh cuối cùng (index = total - 1) phải nằm ở góc PI (180 độ - Sau lưng).
  // Công thức hiện tại: Angle = index * step.
  // Ta muốn: (total - 1) * step + OFFSET = PI.
  // Suy ra: OFFSET = PI - ((total - 1) * step).
  
  const rotationOffset = Math.PI - ((total - 1) * angleStep);

  return images.map((img, i) => {
    // Cộng thêm Offset vào góc
    const theta = i * angleStep + rotationOffset;

    const x = radius * Math.cos(theta);
    const y = 0; 
    const z = radius * Math.sin(theta);

    // Tính rotation Y để ảnh hướng vào tâm
    // Lưu ý: Cộng thêm rotationOffset vào logic xoay
    const rotY = -theta + (Math.PI / 2) + Math.PI; 

    return {
      ...img,
      position: [x, y, z],
      rotation: [0, rotY, 0] 
    };
  });
};

/**
 * (Gợi ý) Layout hình cầu Fibonacci - Bạn có thể dùng sau này
 */
export const getSphereLayout = (images, radius) => {
  // Dùng thuật toán Fibonacci Sphere để rải đều ảnh lên mặt cầu
  const phi = Math.PI * (3 - Math.sqrt(5)); // Góc vàng
  const total = images.length;

  return images.map((img, i) => {
    const y = 1 - (i / (total - 1)) * 2; // y đi từ 1 xuống -1
    const radiusAtY = Math.sqrt(1 - y * y); // Bán kính tại lát cắt y
    const theta = phi * i; 

    const x = Math.cos(theta) * radiusAtY * radius;
    const z = Math.sin(theta) * radiusAtY * radius;
    
    // Trả về vị trí mới, ImageItem sẽ tự lo việc bay nhảy animation
    return {
      ...img,
      position: [x, y * radius, z] 
    };
  });
};