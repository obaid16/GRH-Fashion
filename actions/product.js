"use server";

import connectDB from "../lib/db";
import Product from "../models/Product";
import { revalidatePath } from "next/cache";

// Get Products with Filter, Search, Pagination
export async function getProducts(options = {}) {
  try {
    await connectDB();

    const {
      search = "",
      category = "",
      collectionName = "",
      status = "",
      sort = "newest",
      page = 1,
      limit = 10,
    } = options;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Collection filter
    if (collectionName) {
      query.collectionName = collectionName;
    }

    // Status filter
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: "Archived" }; // Hide archived by default
    }

    // Sorting
    let sortQuery = { createdAt: -1 };
    if (sort === "oldest") sortQuery = { createdAt: 1 };
    else if (sort === "price-low") sortQuery = { finalPrice: 1 };
    else if (sort === "price-high") sortQuery = { finalPrice: -1 };
    else if (sort === "name-asc") sortQuery = { name: 1 };
    else if (sort === "name-desc") sortQuery = { name: -1 };
    else if (sort === "stock-low") sortQuery = { stock: 1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return {
      success: true,
      products: JSON.parse(JSON.stringify(products)),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to load products" };
  }
}

// Create Product
export async function createProduct(productData) {
  try {
    await connectDB();

    // Check slug uniqueness
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Ensure SKU is unique if provided
    if (productData.sku) {
      const existingSku = await Product.findOne({ sku: productData.sku });
      if (existingSku) {
        return { success: false, error: "SKU already exists" };
      }
    }

    const finalPrice = Math.max(0, productData.price - (productData.discount || 0));
    const newProduct = new Product({
      ...productData,
      finalPrice,
    });

    await newProduct.save();
    revalidatePath("/admin/products");
    revalidatePath("/collection");
    return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

// Update Product
export async function updateProduct(productId, productData) {
  try {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Check slug uniqueness if updated
    if (productData.slug && productData.slug !== product.slug) {
      const existingSlug = await Product.findOne({ slug: productData.slug });
      if (existingSlug) {
        return { success: false, error: "Slug is already taken" };
      }
    }

    // Check SKU uniqueness if updated
    if (productData.sku && productData.sku !== product.sku) {
      const existingSku = await Product.findOne({ sku: productData.sku });
      if (existingSku) {
        return { success: false, error: "SKU is already taken" };
      }
    }

    if (productData.price !== undefined) {
      productData.finalPrice = Math.max(0, productData.price - (productData.discount || 0));
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
    
    revalidatePath("/admin/products");
    revalidatePath(`/collection/${product.slug}`);
    revalidatePath("/collection");
    return { success: true, product: JSON.parse(JSON.stringify(updatedProduct)) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}

// Delete Product
export async function deleteProduct(productId) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(productId);
    revalidatePath("/admin/products");
    revalidatePath("/collection");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Bulk Delete Products
export async function bulkDeleteProducts(productIds) {
  try {
    await connectDB();
    await Product.deleteMany({ _id: { $in: productIds } });
    revalidatePath("/admin/products");
    revalidatePath("/collection");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting products:", error);
    return { success: false, error: "Failed to delete selected products" };
  }
}

// Duplicate Product
export async function duplicateProduct(productId) {
  try {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const duplicateData = product.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    duplicateData.name = `${duplicateData.name} (Copy)`;
    duplicateData.slug = `${duplicateData.slug}-copy-${Date.now()}`;
    if (duplicateData.sku) {
      duplicateData.sku = `${duplicateData.sku}-COPY`;
    }
    duplicateData.status = "Draft";

    const duplicatedProduct = await Product.create(duplicateData);
    revalidatePath("/admin/products");
    return { success: true, product: JSON.parse(JSON.stringify(duplicatedProduct)) };
  } catch (error) {
    console.error("Error duplicating product:", error);
    return { success: false, error: "Failed to duplicate product" };
  }
}
