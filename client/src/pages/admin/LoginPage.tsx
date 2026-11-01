import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/common/Input";
import { Lock, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const admin = await login(data.email, data.password);
      setAdmin(admin);
      navigate("/admin");
    } catch (err: any) {
      setServerError(err.message || "Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Image Side (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-cream overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1500&auto=format&fit=crop" 
          alt="Admin" 
          className="h-full w-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-16 left-16 text-white">
          <h1 className="font-display text-5xl">Dreambaby</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/80">Silicone Nursery · Admin Portal</p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-dark text-white mb-6 mx-auto lg:mx-0">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h2 className="font-display text-3xl text-text">Welcome Back</h2>
            <p className="mt-2 text-sm text-text-secondary">Sign in to manage your boutique.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}
            
            <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message} />
            <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-[52px] w-full items-center justify-center gap-3 bg-rose-dark text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose disabled:opacity-60 mt-4"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
