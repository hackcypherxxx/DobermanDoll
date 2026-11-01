import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUploadProductImage, adminDeleteProductImage } from "@/api/admin";
import { Trash2, UploadCloud, Loader2 } from "lucide-react";
import type { ProductImage } from "@/types/api";

interface Props {
  productId: string;
  images: ProductImage[];
}

export function ImageUploader({ productId, images }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => adminUploadProductImage(productId, file, altText || "Product image"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
      setAltText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (err: any) => setError(err.message || "Failed to upload image"),
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => adminDeleteProductImage(productId, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-product", productId] }),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    uploadMutation.mutate(file);
  }

  return (
    <div className="border border-border bg-surface p-6">
      <h2 className="font-display text-xl text-text border-b border-border pb-4 mb-4">Product Images</h2>
      
      {error && <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Existing Images */}
        {images.map((img) => (
          <div key={img.cloudinaryPublicId} className="group relative aspect-[4/5] bg-cream overflow-hidden border border-border">
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => deleteMutation.mutate(img.cloudinaryPublicId)}
                disabled={deleteMutation.isPending}
                className="p-2 bg-white text-rose hover:bg-rose hover:text-white transition-colors rounded-full disabled:opacity-50"
                title="Delete image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {img.position === 0 && (
              <span className="absolute top-2 left-2 bg-rose-dark text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Main</span>
            )}
          </div>
        ))}

        {/* Upload Box */}
        <div className="aspect-[4/5] border-2 border-dashed border-border bg-background flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-rose transition-colors relative">
          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center text-text-secondary">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <span className="text-xs">Uploading...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-text-secondary mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary block mb-1">Alt Text (Optional)</label>
        <input 
          type="text" 
          placeholder="Describe the image for SEO..." 
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="h-10 w-full max-w-md border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none"
        />
        <p className="text-[10px] text-text-secondary mt-1">Type alt text before clicking the upload box.</p>
      </div>
    </div>
  );
}
