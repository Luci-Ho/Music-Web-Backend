//tạo thumnail gắn với link video từ youtube

export const getYoutubeThumbnail = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/,
  );

  if (!match) return null;

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
};
