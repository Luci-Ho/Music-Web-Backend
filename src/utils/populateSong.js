// src/utils/populateSong.js gọi data đúng feil sau khi migrate
export const populateSong = (query) =>
  query
    .populate('artistId', '_id legacyId name img')
    .populate('albumId', '_id legacyId title img')
    .populate('genreId', '_id legacyId title')
    .populate('moodId', '_id legacyId title');
