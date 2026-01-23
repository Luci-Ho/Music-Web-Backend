const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

const isUrl = (s) => typeof s === "string" && /^https?:\/\//i.test(s);
const isDataUrl = (s) => typeof s === "string" && /^data:/i.test(s);

// Chỉ transform các field "img / image / cover / avatar / thumbnail / url"...
const IMAGE_KEYS = new Set([
  "img",
  "image",
  "cover",
  "coverUrl",
  "cover_url",
  "avatar",
  "thumbnail",
  "videoThumbnail",
  "imageUrl",
  "image_url",
  "url",
]);

function toFullUrl(value, baseUrl) {
  if (typeof value !== "string") return value;
  if (!value) return value;

  // đã là url đầy đủ hoặc data url thì giữ nguyên
  if (isUrl(value) || isDataUrl(value)) return value;

  // nếu đã có baseUrl rồi thì nối
  const base = (baseUrl || "").replace(/\/$/, "");
  const path = value.startsWith("/") ? value : `/${value}`;
  return base ? `${base}${path}` : value;
}

function transformDeep(input, baseUrl, visited = new WeakSet()) {
  // primitives
  if (input === null || input === undefined) return input;
  if (typeof input === "string") return input;
  if (typeof input !== "object") return input;

  // tránh vòng lặp tham chiếu
  if (visited.has(input)) return input;
  visited.add(input);

  if (Array.isArray(input)) {
    return input.map((item) => transformDeep(item, baseUrl, visited));
  }

  // object
  const output = { ...input };
  for (const key of Object.keys(output)) {
    const val = output[key];

    // nếu key thuộc nhóm image keys và value là string => convert
    if (IMAGE_KEYS.has(key) && typeof val === "string") {
      output[key] = toFullUrl(val, baseUrl);
      continue;
    }

    // nếu nested => transform tiếp
    if (isObject(val) || Array.isArray(val)) {
      output[key] = transformDeep(val, baseUrl, visited);
    }
  }

  return output;
}

// Middleware: add full url cho response JSON
export default function addFullImageUrl(req, res, next) {
  const oldJson = res.json.bind(res);

  res.json = (data) => {
    try {
      const baseUrl =
        process.env.PUBLIC_BASE_URL ||
        `${req.protocol}://${req.get("host")}`;

      const transformed = transformDeep(data, baseUrl);
      return oldJson(transformed);
    } catch (e) {
      console.error("addFullImageUrl middleware error:", e);
      return oldJson(data);
    }
  };

  next();
}
