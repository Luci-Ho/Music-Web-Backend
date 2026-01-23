import Song from '../models/Song.model.js';
import Artist from '../models/Artist.model.js';

export const getHomeData = async (req, res) => {
    try {
        const userId = req.user?._id;
        const songPopulate = {
            path: 'artistId',
            select: 'name'
        };

        /* =====================================================
           0. SLIDER (FEATURED / TRENDING)
           Tiêu chí:
           - Bài đang active
           - Có ảnh cover
           - Lượt nghe cao nhất
           Mục đích: quảng bá nội dung nổi bật
        ====================================================== */
        const sliderSongs = await Song.find({
            isActive: true,
            'media.image': { $exists: true }
        })
            .sort({ viewCount: -1 })
            .limit(5)
            .populate('artistId', 'name');

        const slider = sliderSongs.map(song => ({
            _id: song._id,
            title: song.title,
            artist: song.artistId?.name || 'Unknown',
            cover_url: song.media.image,      // ⚠️ khớp với Slider FE
            audioUrl: song.media.audioUrl,
            videoUrl: song.media.videoUrl,
            duration: song.duration
        }));

        /* =====================================================
           1. TOP TRENDING SONGS
           Tiêu chí: viewCount cao
        ====================================================== */
        const topTrending = await Song.find({
            isActive: true
        })
            .sort({ viewCount: -1 })
            .limit(5)
            .populate(songPopulate)
            .lean();

        /* =====================================================
           2. NEW RELEASED SONGS
           Tiêu chí: releaseDate mới nhất
        ====================================================== */
        const newReleased = await Song.find({
            isActive: true
        })
            .sort({ releaseDate: -1 })
            .limit(5)
            .populate(songPopulate)
            .lean();

        /* =====================================================
           3. RECOMMENDED / FAVORITE
           - Có login: ưu tiên bài phổ biến (tạm)
           - Chưa login: random để đa dạng
        ====================================================== */
        let recommended = [];

        if (userId) {
            recommended = await Song.find({ isActive: true })
                .sort({ viewCount: -1 })
                .limit(5)
                .populate(songPopulate)
                .lean();
        } else {
            recommended = await Song.aggregate([
                { $match: { isActive: true } },
                { $sample: { size: 5 } }
            ]);
        }

        /* =====================================================
           4. MUSIC VIDEOS
           Điều kiện:
           - Có media.videoUrl (YouTube, v.v.)
           - Ưu tiên bài hot
        ====================================================== */
        const videos = await Song.find({
            isActive: true,
            'media.videoUrl': { $exists: true, $ne: '' }
        })
            .sort({ viewCount: -1 })
            .limit(8)
            .populate(songPopulate)
            .lean();

        /* =====================================================
           5. ARTISTS
           Tiêu chí:
           - Độ phổ biến cao
        ====================================================== */
        const artists = await Artist.find()
            .sort({ popularity: -1 })
            .limit(6)
            // .populate(songPopulate)
            .lean();

        /* =====================================================
           RESPONSE – TRẢ VỀ 1 LẦN DUY NHẤT
        ====================================================== */
        return res.status(200).json({
            slider,
            topTrending,
            newReleased,
            recommended,
            videos,
            artists
        });

    } catch (error) {
        console.error('HOME CONTROLLER ERROR:', error);
        return res.status(500).json({
            message: 'Failed to load home data'
        });
    }
};
