import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Sparkles, UploadCloud, Loader2, AlertTriangle, Trash2, Upload } from "lucide-react";
import { 
  adminGetProduct, 
  adminCreateProduct, 
  adminUpdateProduct, 
  adminListCategories, 
  adminUploadImage, 
  adminGenerateDescription 
} from "@/api/admin";
import { productSchema, type ProductFormValues } from "@/schemas/product";
import { Input } from "@/components/common/Input";

type UploadedImage = { url: string; publicId: string };
type PendingFile = { file: File; previewUrl: string };

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const queryClient = useQueryClient();

  const { 
    data: product, 
    isLoading, 
    isError,
    error: productError,
  } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => adminGetProduct(id!),
    enabled: isEditing,
    retry: false,
  });

  if (isEditing && isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-3 w-32 bg-cream" />
          <div className="h-10 w-1/2 bg-cream" />
          <div className="grid lg:grid-cols-[380px_1fr] gap-8">
            <div className="h-96 bg-cream" />
            <div className="space-y-4">
              <div className="h-32 bg-cream" />
              <div className="h-48 bg-cream" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && isError) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <h2 className="font-display text-2xl text-red-700">Failed to load product</h2>
          <p className="text-sm text-red-600 mt-2">{productError?.message || "Unknown error"}</p>
          <Link to="/admin/products" className="mt-6 inline-block bg-rose-dark px-6 py-2 text-[10px] font-bold uppercase text-white">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      key={product?._id || "new-product"}
      product={product}
      isEditing={isEditing}
      queryClient={queryClient}
    />
  );
}

function ProductForm({
  product,
  isEditing,
  queryClient,
}: {
  product: any;
  isEditing: boolean;
  queryClient: any;
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    product?.images?.map((img: any) => ({
      url: img.url,
      publicId: img.cloudinaryPublicId,
    })) ?? []
  );

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminListCategories,
  });

  const initialValues: ProductFormValues = {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? undefined,
    category:
      product?.category && typeof product.category === "object"
        ? product.category._id
        : product?.category ?? "",
    stock: product?.stock ?? 1,
    inventoryType: product?.inventoryType ?? "IN_STOCK",
    material: product?.material ?? "",
    size: product?.size ?? "",
    weight: product?.weight ?? "",
    genderPresentation: product?.genderPresentation ?? "",
    includedAccessories: (product?.includedAccessories ?? []).join(", "),
    tags: (product?.tags ?? []).join(", "),
    // FIXED: Defaults to true if it's a new product, otherwise respects the DB value
    isPublished: product ? (product.isPublished ?? true) : true,
    isFeatured: product?.isFeatured ?? false,
    isBestSeller: product?.isBestSeller ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? "",
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPending: PendingFile[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPendingFiles((prev) => [...prev, ...newPending]);
    e.target.value = "";
  }

  function removePending(index: number) {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleUploadAll() {
    if (pendingFiles.length === 0) return;
    setIsUploading(true);
    setErrorMsg(null);

    try {
      const uploaded: UploadedImage[] = [];
      for (const pending of pendingFiles) {
        const res = await adminUploadImage(pending.file);
        uploaded.push(res);
      }
      setUploadedImages((prev) => [...prev, ...uploaded]);
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPendingFiles([]);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload one or more images.");
    } finally {
      setIsUploading(false);
    }
  }

  function removeUploaded(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerateAI() {
    const { name, shortDescription } = getValues();
    if (!name || !shortDescription) {
      setErrorMsg("Please enter a Product Name and Short Description before using AI.");
      return;
    }
    if (uploadedImages.length === 0) {
      setErrorMsg("Please upload at least one image (the MAIN image is analyzed by AI).");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await adminGenerateDescription({
        name,
        shortDescription,
        imageUrl: uploadedImages[0].url,
      });
      setValue("description", res.description, { shouldValidate: true });
    } catch (err: any) {
      setErrorMsg(err.message || "AI generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  const createMutation = useMutation({
    mutationFn: adminCreateProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate(`/admin/products/${newProduct._id}/edit`, { replace: true });
      alert("Product created successfully!");
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to create product."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminUpdateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
      alert("Product saved successfully!");
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to save product."),
  });

  function onSubmit(values: ProductFormValues) {
    if (uploadedImages.length === 0) {
      setErrorMsg("Please upload at least one product image before saving.");
      return;
    }
    if (pendingFiles.length > 0) {
      setErrorMsg("You have images waiting to be uploaded. Click 'Upload X Images' before saving.");
      return;
    }

    const payload = {
      ...values,
      images: uploadedImages.map((img, index) => ({
        url: img.url,
        cloudinaryPublicId: img.publicId,
        alt: values.name,
        position: index,
      })),
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      includedAccessories: values.includedAccessories
        ? values.includedAccessories.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      compareAtPrice: values.compareAtPrice || undefined,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      currency: "USD",
    };

    if (isEditing) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 md:px-0">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary hover:text-text mb-6"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Products
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-text">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isEditing ? "Update the details below." : "Upload images first, then generate the description with AI."}
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={createMutation.isPending || updateMutation.isPending || isUploading}
          className="flex items-center gap-2 bg-rose-dark px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          <Save className="h-4 w-4" />
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Product"}
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        <div className="border border-border bg-surface p-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="font-display text-xl text-text">Product Images</h2>
            <span className="text-xs text-text-secondary font-bold">
              {uploadedImages.length} uploaded{pendingFiles.length > 0 ? ` · ${pendingFiles.length} pending` : ""}
            </span>
          </div>

          {uploadedImages.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Uploaded</p>
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="aspect-[4/5] bg-background border border-border relative group">
                    <img src={img.url} alt="Product" className="absolute inset-0 h-full w-full object-cover" />
                    {idx === 0 && (
                      <div className="absolute top-0 left-0 bg-rose-dark text-white text-[9px] font-bold px-2 py-1">MAIN</div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeUploaded(idx)}
                      className="absolute top-2 right-2 bg-white/90 p-1.5 text-rose-dark rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-dark hover:text-white"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 mb-2">
                Waiting to Upload ({pendingFiles.length})
              </p>
              <div className="grid grid-cols-2 gap-3">
                {pendingFiles.map((pending, idx) => (
                  <div key={idx} className="aspect-[4/5] bg-background border-2 border-dashed border-amber-300 relative group">
                    <img src={pending.previewUrl} alt="Pending" className="absolute inset-0 h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePending(idx)}
                      className="absolute top-2 right-2 bg-white/90 p-1.5 text-rose-dark rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-dark hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleUploadAll}
                disabled={isUploading}
                className="mt-3 w-full bg-amber-600 text-white py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <><Loader2 className="h-3 w-3 animate-spin" /> Uploading {pendingFiles.length}...</>
                ) : (
                  <><Upload className="h-3 w-3" /> Upload {pendingFiles.length} Image{pendingFiles.length > 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          )}

          <div className="aspect-[4/5] border-2 border-dashed border-border bg-background flex flex-col items-center justify-center text-center cursor-pointer hover:border-rose relative">
            <UploadCloud className="h-6 w-6 text-text-secondary mb-2" />
            <span className="text-[10px] font-bold uppercase text-text-secondary">Select Images</span>
            <span className="text-[9px] text-text-secondary/60 mt-1">Choose up to 5 at once</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </div>

          <div className="bg-blush/50 border border-rose/20 p-3 text-[11px] text-text-secondary leading-relaxed mt-4">
            <strong className="text-rose-dark">Tip:</strong> Select files first, review them, then click "Upload" to send them to the server. The first uploaded image (MAIN) is used by AI.
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-xl text-text border-b border-border pb-4">Basic Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Product Name" {...register("name")} error={errors.name?.message} />
              </div>
              <Input label="SKU" {...register("sku")} error={errors.sku?.message} />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Category</label>
                <select
                  {...register("category")}
                  className="h-11 border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none"
                >
                  <option value="">Select a category...</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Input label="Short Description" {...register("shortDescription")} error={errors.shortDescription?.message} />
              </div>
            </div>
          </div>

          <div className="border border-border bg-surface p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-4 gap-3">
              <div>
                <h2 className="font-display text-xl text-text">Full Description (HTML)</h2>
                <p className="text-xs text-text-secondary mt-1">Generated from the MAIN image.</p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || uploadedImages.length === 0}
                className="flex items-center gap-2 bg-blush text-rose-dark px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-rose hover:text-white transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              rows={10}
              {...register("description")}
              placeholder="Click 'Generate with AI' above, or type HTML manually..."
              className="w-full border border-border p-3 text-sm font-mono focus:border-rose-dark focus:outline-none bg-background"
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div className="border border-border bg-surface p-6 grid sm:grid-cols-2 gap-4">
            <h2 className="font-display text-xl text-text border-b border-border pb-4 sm:col-span-2">Pricing & Inventory</h2>
            <Input label="Price ($)" type="number" step="0.01" {...register("price")} error={errors.price?.message} />
            <Input label="Compare At Price ($)" type="number" step="0.01" {...register("compareAtPrice")} />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Inventory Type</label>
              <select {...register("inventoryType")} className="h-11 border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none">
                <option value="IN_STOCK">In Stock</option>
                <option value="MADE_TO_ORDER">Made to Order</option>
                <option value="PRE_ORDER">Pre-Order</option>
              </select>
            </div>
            <Input label="Stock Quantity" type="number" {...register("stock")} error={errors.stock?.message} />
          </div>

          <div className="border border-border bg-surface p-6 grid sm:grid-cols-2 gap-4">
            <h2 className="font-display text-xl text-text border-b border-border pb-4 sm:col-span-2">Attributes</h2>
            <Input label="Material" {...register("material")} error={errors.material?.message} />
            <Input label="Size" {...register("size")} error={errors.size?.message} />
            <Input label="Weight" {...register("weight")} error={errors.weight?.message} />
            <Input label="Gender Presentation" {...register("genderPresentation")} error={errors.genderPresentation?.message} />
            <div className="sm:col-span-2"><Input label="Included Accessories (comma separated)" {...register("includedAccessories")} /></div>
            <div className="sm:col-span-2"><Input label="Tags (comma separated)" {...register("tags")} /></div>
          </div>

          <div className="border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-xl text-text border-b border-border pb-4">SEO Settings (Optional)</h2>
            <Input label="SEO Title" {...register("seoTitle")} placeholder="Overrides the default product title" />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">SEO Description</label>
              <textarea
                rows={2}
                {...register("seoDescription")}
                placeholder="Overrides the default short description"
                className="border border-border p-3 text-sm focus:border-rose-dark focus:outline-none bg-background"
              />
            </div>
          </div>

          <div className="border border-border bg-surface p-6">
            <h2 className="font-display text-xl text-text border-b border-border pb-4 mb-4">Visibility</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "isPublished", label: "Published" },
                { name: "isFeatured", label: "Featured" },
                { name: "isBestSeller", label: "Best Seller" },
                { name: "isNewArrival", label: "New Arrival" },
              ].map((field) => (
                <label key={field.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(field.name as keyof ProductFormValues)}
                    className="accent-rose-dark h-4 w-4"
                  />
                  <span className="text-sm text-text">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 inset-x-0 p-4 bg-surface border-t border-border z-40">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={createMutation.isPending || updateMutation.isPending || isUploading}
          className="w-full flex items-center justify-center gap-2 bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}
