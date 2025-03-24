import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String },
		media: [
			{
				url: { type: String, required: true },
				type: { type: String, enum: ['image', 'video'], required: true },
				thumbnail: { type: String },
				width: { type: Number },
				height: { type: Number },
				duration: { type: Number }, // For videos
				orientation: { type: String, enum: ['landscape', 'portrait', 'square'] }
			}
		],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				content: { type: String },
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
