// middleware/addFullImageUrl.js
export default function addFullImageUrl(req, res, next) {
  // Lấy base URL từ request (vd: http://localhost:5000)
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Hàm helper để thêm domain vào đường dẫn ảnh
  const transformImageUrl = (obj) => {
    if (!obj) return obj;
    const fieldsToTransform = ["cover_url", "thumbnail", "img", "avatar"];

    // duyệt qua tất cả key trong object
    for (const key in obj) {
      if (
        fieldsToTransform.includes(key) &&
        typeof obj[key] === "string" &&
        obj[key].startsWith("/uploads")
      ) {
        obj[key] = `${baseUrl}${obj[key]}`;
      } else if (typeof obj[key] === "object") {
        transformImageUrl(obj[key]); // đệ quy cho nested object
      }
    }
    return obj;
  };

  // Ghi đè hàm res.json để tự động transform trước khi trả về
  const originalJson = res.json;
  res.json = function (data) {
    if (Array.isArray(data)) {
      data = data.map((item) => transformImageUrl(item));
    } else if (typeof data === "object") {
      data = transformImageUrl(data);
    }
    return originalJson.call(this, data);
  };

  next();
}