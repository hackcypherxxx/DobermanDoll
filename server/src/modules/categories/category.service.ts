import slugify from "slugify";
import { Category } from "./category.model.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.schema.js";
import { ApiError } from "../../utils/ApiError.js";

export const categoryService = {
  async create(data: CreateCategoryInput) {
    const slug = slugify(data.name, { lower: true, strict: true });
    
    const existing = await Category.findOne({ slug });
    if (existing) throw new ApiError(409, "Category with this name already exists");

    const category = new Category({ ...data, slug } as any);
    return category.save();
  },

  async getAllPublic() {
    return Category.find({ isPublished: true }).sort({ sortOrder: 1, name: 1 });
  },

  async getAllAdmin() {
    return Category.find().sort({ sortOrder: 1, name: 1 });
  },

  async getBySlug(slug: string) {
    const category = await Category.findOne({ slug, isPublished: true });
    if (!category) throw new ApiError(404, "Category not found");
    return category;
  },

  async update(id: string, data: UpdateCategoryInput) {
    const category = await Category.findById(id);
    if (!category) throw new ApiError(404, "Category not found");

    if (data.name && data.name !== category.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true });
      const existing = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existing) throw new ApiError(409, "Category name already taken");
      category.slug = newSlug;
    }

    Object.assign(category, data);
    return category.save();
  },

  async delete(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new ApiError(404, "Category not found");
    return category;
  }
};
