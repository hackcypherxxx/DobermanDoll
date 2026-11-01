import slugify from "slugify";
import { Product } from "./product.model.js";
import type { CreateProductInput, UpdateProductInput } from "./product.schema.js";
import { ApiError } from "../../utils/ApiError.js";

export const productService = {
  async create(data: CreateProductInput) {
    const slug = slugify(data.name, { lower: true, strict: true });
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) throw new ApiError(409, "Product with this name already exists");
    const existingSku = await Product.findOne({ sku: data.sku });
    if (existingSku) throw new ApiError(409, "Product with this SKU already exists");
    const product = new Product({ ...data, slug } as any);
    return product.save();
  },

  async getAllPublic(query: { category?: string; featured?: boolean; bestSeller?: boolean; newArrival?: boolean }) {
    const filter: any = { isPublished: true };
    if (query.category) filter.category = query.category;
    if (query.featured) filter.isFeatured = true;
    if (query.bestSeller) filter.isBestSeller = true;
    if (query.newArrival) filter.isNewArrival = true;
    return Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
  },

  async getAllAdmin() {
    return Product.find().populate("category", "name slug").sort({ createdAt: -1 });
  },

  async getByIdAdmin(id: string) {
    const product = await Product.findById(id).populate("category", "name slug");
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  },

  async getBySlug(slug: string) {
    const product = await Product.findOne({ slug, isPublished: true }).populate("category", "name slug");
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    if (data.name && data.name !== product.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true });
      const existing = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existing) throw new ApiError(409, "Product name already taken");
      product.slug = newSlug;
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSku = await Product.findOne({ sku: data.sku, _id: { $ne: id } });
      if (existingSku) throw new ApiError(409, "SKU already in use");
    }

    // Explicitly handle images array so Mongoose updates the subdocuments
    if (data.images !== undefined) {
      product.images = data.images as any;
    }

    // Assign the remaining fields individually so we don't overwrite images
    const { images: _omitImages, ...rest } = data;
    Object.assign(product, rest);

    return product.save();
  },

  async delete(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }
};
