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
  const phi = Math.PI * (3 - Math.sqrt(5)); // Góc vàng
  const total = images.length;

  
  const limits = 0.98; 

  return images.map((img, i) => {
    // Xử lý trường hợp đặc biệt để tránh chia cho 0
    if (total === 1) {
      return { ...img, position: [0, 0, radius] };
    }

    // --- LOGIC TỪ DỰ ÁN CŨ CỦA BẠN ---
    const ratio = i / (total - 1); // Chạy từ 0 đến 1
    
    // Biến đổi y chạy trong khoảng [limits, -limits]
    // Ví dụ limits = 0.9 thì y chạy từ 0.9 xuống -0.9
    const y = limits - (ratio * (limits * 2));

    // Tính bán kính tại lát cắt y hiện tại
    // Math.max(0, ...) là lưới an toàn để không bao giờ bị căn bậc 2 của số âm
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    
    const theta = phi * i; 

    // Tính toạ độ x, z
    const x = Math.cos(theta) * radiusAtY * radius;
    const z = Math.sin(theta) * radiusAtY * radius;
    
    return {
      ...img,
      position: [x, y * radius, z] 
    };
  });
};