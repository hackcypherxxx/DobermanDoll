import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListProducts, adminDeleteProduct } from "@/api/admin";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminListProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  if (isLoading) return <div className="p-8 text-center text-text-secondary animate-pulse">Loading products...</div>;

  const filteredProducts = (products ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-text">Products</h1>
          <p className="text-sm text-text-secondary mt-1">{products?.length || 0} items in catalogue</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-rose-dark px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full border border-border bg-surface pl-9 pr-3 text-sm text-text focus:border-rose-dark focus:outline-none"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const image = product.images?.[0]?.url || "";
          const isOutOfStock = product.inventoryType === "IN_STOCK" && product.stock <= 0;
          
          return (
            <div key={product._id} className="group border border-border bg-surface flex flex-col relative">
              
              {/* Image */}
              <div className="aspect-[4/5] w-full bg-cream relative overflow-hidden">
                {image ? (
                  <img src={image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-text-secondary">No Image</div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {!product.isPublished && <span className="bg-text text-white text-[9px] font-bold uppercase px-2 py-0.5">Draft</span>}
                  {product.isFeatured && <span className="bg-rose-dark text-white text-[9px] font-bold uppercase px-2 py-0.5">Featured</span>}
                  {isOutOfStock && <span className="bg-rose text-white text-[9px] font-bold uppercase px-2 py-0.5">Sold Out</span>}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col flex-1">
                <p className="font-display text-lg text-text leading-tight line-clamp-2">{product.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-text-secondary mt-1">SKU: {product.sku}</p>
                
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-medium text-sm tabular-nums">{formatCurrency(product.price)}</span>
                  <span className="text-xs text-text-secondary">{product.stock} in stock</span>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2 mt-auto">
                  <Link to={`/product/${product.slug}`} target="_blank" className="p-2 text-text-secondary hover:text-text transition-colors" title="View on site">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <div className="flex gap-1">
                    <Link to={`/admin/products/${product._id}/edit`} className="p-2 text-rose-dark hover:bg-cream transition-colors" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => { if(confirm("Delete this product permanently?")) deleteMutation.mutate(product._id); }}
                      className="p-2 text-text-secondary hover:text-rose transition-colors" title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <div className="col-span-full p-12 text-center text-sm text-text-secondary border border-border bg-surface">
            No products found. Click "Add Product" to create your first one.
          </div>
        )}
      </div>
    </div>
  );
}
