import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Media name is required"],
    },
    url: {
      type: String,
      required: [true, "Media URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    folder: {
      type: String,
      default: "/",
    },
    size: {
      type: Number,
    },
    type: {
      type: String,
      default: "image",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);
