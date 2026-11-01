import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListCategories, adminCreateCategory, adminDeleteCategory } from "@/api/admin";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", isPublished: true });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminListCategories,
  });

  const createMutation = useMutation({
    mutationFn: adminCreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setIsModalOpen(false);
      setFormData({ name: "", description: "", isPublished: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate(formData);
  }

  if (isLoading) return <div className="p-8 text-center text-text-secondary animate-pulse">Loading categories...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-text">Categories</h1>
          <p className="text-sm text-text-secondary mt-1">Manage how your dolls are grouped.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-dark px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="border border-border bg-surface">
        <ul className="divide-y divide-border">
          {(categories ?? []).map((cat) => (
            <li key={cat._id} className="flex items-center justify-between p-4 hover:bg-cream/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-cream text-rose-dark">
                  <FolderOpen className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-text text-sm">{cat.name}</p>
                  <p className="text-xs text-text-secondary">{cat.description || "No description"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-1 border ${cat.isPublished ? 'border-success text-success bg-success/5' : 'border-text-secondary text-text-secondary'}`}>
                  {cat.isPublished ? "Published" : "Draft"}
                </span>
                <button 
                  onClick={() => { if(confirm("Delete this category?")) deleteMutation.mutate(cat._id); }}
                  className="p-2 text-text-secondary hover:text-rose transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {categories?.length === 0 && <li className="p-8 text-center text-sm text-text-secondary">No categories yet. Add one to organize your shop.</li>}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Category Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Full Silicone" />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-border p-3 text-sm focus:border-rose-dark focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="accent-rose-dark" />
            Publish immediately
          </label>
          <button type="submit" disabled={createMutation.isPending} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white mt-4 disabled:opacity-50">
            {createMutation.isPending ? "Creating..." : "Create Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
