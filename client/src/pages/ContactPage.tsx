import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Mail, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { sendContactMessage } from "@/api/contact";
import { contactSchema, type ContactFormValues } from "@/schemas/contact";
import { Input } from "@/components/common/Input";
import { ApiClientError } from "@/api/client";

// High-end, warm editorial image for the hero
const HERO_IMAGE = "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2000&auto=format&fit=crop";

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(values: ContactFormValues) {
    mutation.mutate(values);
  }

  const serverError =
    mutation.error instanceof ApiClientError
      ? mutation.error.message
      : mutation.error
      ? "Something went wrong. Please try again."
      : null;

  return (
    <div className="bg-background pb-24">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative flex h-[40vh] w-full items-center justify-center overflow-hidden bg-cream md:h-[50vh]">
        <img 
          src={HERO_IMAGE} 
          alt="Get in touch" 
          className="absolute inset-0 h-full w-full object-cover object-center" 
        />
        {/* Dark Gradient Overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">
            Get in Touch
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-6xl">
            We'd Love to Hear From You
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
            Whether you have a question about a specific doll, need help with an order, 
            or just want to say hello, our team is here to help.
          </p>
        </div>
      </section>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="page-container pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1fr_380px] md:gap-20">
          
          {/* Form Column */}
          <div className="bg-surface border border-border p-6 sm:p-10 md:p-12 shadow-sm">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
                </span>
                <h2 className="mt-6 font-display text-3xl text-text">Message Sent</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
                  Thank you for reaching out. We have received your message and will reply to you within 24–48 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    reset();
                    mutation.reset();
                  }}
                  className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-dark underline hover:text-rose"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {serverError && (
                  <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {serverError}
                  </div>
                )}
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Your Name"
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="How can we help you?"
                    {...register("message")}
                    className="w-full border border-border bg-background px-3 py-3 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose-dark focus:outline-none resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="group flex h-[52px] w-full items-center justify-center gap-3 bg-rose-dark text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                  {!mutation.isPending && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Column */}
          <div className="space-y-10 md:pt-4">
            <div>
              <h3 className="flex items-center gap-3 font-display text-xl text-text">
                <Mail className="h-5 w-5 text-rose" strokeWidth={1.5} />
                Email Us
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                For general inquiries, order support, or product questions:
              </p>
              <a href="mailto:hello@dreambabynursery.com" className="mt-1 inline-block text-sm font-medium text-rose-dark hover:underline">
                hello@dreambabynursery.com
              </a>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="flex items-center gap-3 font-display text-xl text-text">
                <Clock className="h-5 w-5 text-rose" strokeWidth={1.5} />
                Business Hours
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Monday – Friday<br />
                9:00 AM – 5:00 PM (EST)
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="flex items-center gap-3 font-display text-xl text-text">
                <MessageSquare className="h-5 w-5 text-rose" strokeWidth={1.5} />
                Quick Answer?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                You might find the answer you're looking for in our Frequently Asked Questions.
              </p>
              <a href="/faq" className="mt-3 inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-rose-dark underline hover:text-rose">
                Visit the FAQ
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
