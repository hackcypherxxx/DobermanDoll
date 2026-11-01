import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2000&auto=format&fit=crop",
  detail1: "https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=800&auto=format&fit=crop",
  detail2: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      
      {/* ==================== HERO ==================== */}
      <section className="relative h-[50vh] w-full overflow-hidden bg-cream md:h-[60vh]">
        <img src={IMAGES.hero} alt="Our Story" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">
            The Journey
          </span>
          <h1 className="mt-4 font-display text-4xl text-white md:text-6xl lg:text-7xl">
            Our Story
          </h1>
        </div>
      </section>

      {/* ==================== PHILOSOPHY ==================== */}
      <section className="page-container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">Our Philosophy</span>
          <h2 className="mt-6 font-display text-3xl leading-tight text-text md:text-5xl">
            We believe in the quiet comfort of a <span className="italic text-rose-dark">perfectly crafted companion.</span>
          </h2>
          <p className="mt-8 text-[15px] leading-relaxed text-text-secondary md:text-base">
            Dreambaby Silicone Nursery was born from a simple idea: that a reborn doll is more than just a collectible. It is a piece of art, a source of comfort, and a deeply personal treasure. We curate only the most lifelike, beautifully detailed dolls, ensuring that every piece that leaves our nursery feels real, warm, and full of love.
          </p>
        </div>
      </section>

      {/* ==================== EDITORIAL IMAGE GRID ==================== */}
      <section className="bg-cream py-20 md:py-28">
        <div className="page-container grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="aspect-[4/5] w-full overflow-hidden bg-background">
            <img src={IMAGES.detail1} alt="Craftsmanship" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center md:pl-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">The Craft</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-text md:text-4xl lg:text-5xl">
              A Little Love in<br/>Every Detail
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">
              From the delicate weight in your arms to the hand-rooted hair and carefully painted blushing, every element is considered. We spend hours reviewing every doll in our collection to ensure it meets our strict standards of realism and quality.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
              When you unbox a Dreambaby, you are not just opening a package. You are welcoming a little treasure into your home.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== THE PROCESS ==================== */}
      <section className="page-container py-20 md:py-28">
        <div className="mb-12 text-center md:mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">Our Process</span>
          <h2 className="mt-4 font-display text-3xl text-text md:text-5xl">How We Curate</h2>
        </div>
        
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="border-t border-border pt-8">
            <span className="font-display text-4xl italic text-rose-dark/40">01</span>
            <h3 className="mt-4 font-display text-2xl text-text">Thoughtful Selection</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              We source only from artisans who share our obsession with lifelike detail, soft silicone textures, and realistic weighting.
            </p>
          </div>
          <div className="border-t border-border pt-8">
            <span className="font-display text-4xl italic text-rose-dark/40">02</span>
            <h3 className="mt-4 font-display text-2xl text-text">Careful Inspection</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Every doll is individually inspected, photographed, and prepared with the utmost care before it is listed on our website.
            </p>
          </div>
          <div className="border-t border-border pt-8">
            <span className="font-display text-4xl italic text-rose-dark/40">03</span>
            <h3 className="mt-4 font-display text-2xl text-text">Your Little Treasure</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Your doll is packaged securely and shipped with tracking, ready to become a beloved member of your family.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== QUOTE BLOCK ==================== */}
      <section className="bg-rose-dark py-20 text-center md:py-32">
        <div className="page-container">
          <blockquote className="mx-auto max-w-4xl font-display text-2xl italic leading-snug text-white md:text-4xl lg:text-5xl">
            &ldquo;A reborn doll is a little companion, a treasured keepsake, and a reminder of the joy found in life&rsquo;s smallest moments.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="page-container py-20 text-center md:py-28">
        <h2 className="font-display text-3xl text-text md:text-5xl">Find Your Little Treasure</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-text-secondary">
          Explore our curated collection of beautifully detailed reborn dolls.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-[52px] items-center gap-3 bg-rose px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose-dark"
        >
          Shop the Collection
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </div>
  );
}
