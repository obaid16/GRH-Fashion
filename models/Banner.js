import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
    },
    type: {
      type: String,
      enum: ["Desktop", "Mobile", "Popup", "Offer", "Collection"],
      default: "Desktop",
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image URL is required"],
    },
    link: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
