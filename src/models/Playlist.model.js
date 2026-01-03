import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
	playlistId: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	description: { type: String, default: '' },
	ownerId: { type: String, required: true },
	coverImage: { type: String, default: null },
	isPublic: { type: Boolean, default: false },
	songs: [{ type: String }],
	likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Playlist', PlaylistSchema);

