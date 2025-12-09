// Mỗi mode thiết kế 1 cấu hình khác nhau
export const LAYOUT_CONFIGS = {
  circle: {
    // Circle cần nhìn hơi từ trên xuống để thấy độ sâu
    initialCameraPosition: [0, 2, 15], 
    // Circle trải ngang nên không cần chỉnh độ cao ảnh
    itemScale: [1, 1, 1],
    fov: 60,
    rotateSpeed:0.1,
    doubleSide:false,
    rigMode: 'C',
  },
  
  sphere: {
    // Sphere đẹp nhất khi nhìn trực diện vào tâm
    initialCameraPosition: [0, 0, 10], 
    
    // Có thể chỉnh scale khác nếu muốn
    itemScale: [1, 1, 1],
    fov: 60,
    rotateSpeed:0.5,
    doubleSide:true,
    rigMode: 'A',
  },
  
};