import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Sparkles, UploadCloud, Loader2, AlertTriangle } from "lucide-react";
import { adminGetProduct, adminCreateProduct, adminUpdateProduct, adminListCategories, adminUploadImage, adminGenerateDescription } from "@/api/admin";
import { productSchema, type ProductFormValues } from "@/schemas/product";
import { Input } from "@/components/common/Input";

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploadedImage, setUploadedImage] = useState<{ url: string; publicId: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: categories } = useQuery({ queryKey: ["admin-categories"], queryFn: adminListCategories });
  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => adminGetProduct(id!),
    enabled: isEditing,
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      inventoryType: "IN_STOCK",
      isPublished: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      stock: 1,
      price: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (product) {
      reset({
        ...product,
        category: typeof product.category === "object" ? product.category._id : product.category,
        compareAtPrice: product.compareAtPrice || 0,
        tags: product.tags.join(", "),
        includedAccessories: product.includedAccessories.join(", "),
      } as unknown as ProductFormValues);
      if (product.images?.[0]) {
        setUploadedImage({ url: product.images[0].url, publicId: product.images[0].cloudinaryPublicId });
      }
    }
  }, [product, reset]);

  // Handle Image Upload
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const res = await adminUploadImage(file);
      setUploadedImage(res);
    } catch (err: any) {
      setErrorMsg("Failed to upload image. Check file size/format.");
    } finally {
      setIsUploading(false);
    }
  }

  // Handle AI Generation
  async function handleGenerateAI() {
    const name = watch("name");
    const shortDescription = watch("shortDescription");
    if (!name || !shortDescription) return setErrorMsg("Please enter a Name and Short Description first.");
    
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await adminGenerateDescription({ 
        name, 
        shortDescription, 
        imageUrl: uploadedImage?.url 
      });
      setValue("description", res.description);
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
      alert("Product created! You can now add more details if needed.");
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminUpdateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
      alert("Product saved successfully!");
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  function onSubmit(values: ProductFormValues) {
    const payload = {
      ...values,
      // Only send the image if we have one uploaded
      images: uploadedImage ? [{ url: uploadedImage.url, cloudinaryPublicId: uploadedImage.publicId, alt: values.name, position: 0 }] : undefined,
      tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      includedAccessories: values.includedAccessories ? values.includedAccessories.split(",").map(t => t.trim()).filter(Boolean) : [],
      compareAtPrice: values.compareAtPrice || undefined,
    };

    if (isEditing) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  }

  if (isEditing && isLoading) return <div className="p-8 text-center text-text-secondary animate-pulse">Loading product...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary hover:text-text mb-6">
        <ArrowLeft className="h-3 w-3" /> Back to Products
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-text">{isEditing ? "Edit Product" : "Add New Product"}</h1>
        <button onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 bg-rose-dark px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose disabled:opacity-50">
          <Save className="h-4 w-4" /> {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Product"}
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0" /> <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">
        
        {/* Left Column: Image Upload */}
        <div className="border border-border bg-surface p-6 sticky top-24">
          <h2 className="font-display text-xl text-text border-b border-border pb-4 mb-4">Product Image</h2>
          <div className="aspect-[4/5] border-2 border-dashed border-border bg-background flex flex-col items-center justify-center text-center cursor-pointer hover:border-rose relative overflow-hidden">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-rose-dark" />
            ) : uploadedImage ? (
              <img src={uploadedImage.url} alt="Product" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-text-secondary mb-2" />
                <span className="text-[10px] font-bold uppercase text-text-secondary">Click to Upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <p className="text-[10px] text-text-secondary mt-3 text-center">Upload an image to use for the AI generator.</p>
        </div>

        {/* Right Column: Form */}
        <div className="space-y-6">
          <div className="border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-xl text-text border-b border-border pb-4">Basic Info</h2>
            <Input label="Product Name" {...register("name")} error={errors.name?.message} />
            <Input label="SKU" {...register("sku")} error={errors.sku?.message} />
            <Input label="Short Description" {...register("shortDescription")} error={errors.shortDescription?.message} />
          </div>

          <div className="border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display text-xl text-text">Full Description (HTML)</h2>
              <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-2 bg-blush text-rose-dark px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-rose hover:text-white transition-colors disabled:opacity-50">
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea rows={10} {...register("description")} placeholder="Click 'Generate with AI' or type HTML..." className="w-full border border-border p-3 text-sm font-mono focus:border-rose-dark focus:outline-none" />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div className="border border-border bg-surface p-6 grid sm:grid-cols-2 gap-4">
            <h2 className="font-display text-xl text-text border-b border-border pb-4 sm:col-span-2">Pricing & Organization</h2>
            <Input label="Price ($)" type="number" step="0.01" {...register("price")} error={errors.price?.message} />
            <Input label="Compare At Price ($)" type="number" step="0.01" {...register("compareAtPrice")} />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Category</label>
              <select {...register("category")} className="h-11 border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none">
                <option value="">Select a category...</option>
                {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
            </div>
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
                  <input type="checkbox" {...register(field.name as keyof ProductFormValues)} className="accent-rose-dark h-4 w-4" />
                  <span className="text-sm text-text">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
