import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    subCategory: {
      type: String,
    },
    collectionName: {
      type: String,
    },
    brand: {
      type: String,
      default: "GRH Atelier",
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Women", "Men", "Unisex"],
      default: "Unisex",
    },
    fabric: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

// Auto-calculate final price on save
ProductSchema.pre("save", function (next) {
  if (this.price !== undefined) {
    this.finalPrice = Math.max(0, this.price - (this.discount || 0));
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
