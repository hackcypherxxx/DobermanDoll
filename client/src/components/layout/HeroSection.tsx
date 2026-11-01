import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";

const SLIDES = [
  {
    // Direct URL to a realistic, soft-focus image matching the reference hero
    src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2000&auto=format&fit=crop",
    alt: "A beautifully detailed reborn doll",
    caption: "Soft, lifelike touch just like a real baby",
  }
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-cream md:h-[75vh]">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          
          {/* Caption Box */}
          <div className="absolute bottom-10 right-6 md:bottom-16 md:right-12">
            <div className="bg-white/90 px-6 py-4 backdrop-blur-md md:px-10 md:py-6">
              <p className="font-display text-lg italic text-text md:text-2xl">
                {slide.caption}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Arrows (Hidden if only 1 slide, but kept for structure) */}
      {SLIDES.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:left-8 md:h-12 md:w-12" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:right-8 md:h-12 md:w-12" aria-label="Next slide">
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Scroll to top button */}
      <button onClick={scrollToTop} className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:bottom-8 md:right-8">
        <ArrowUp className="h-5 w-5" />
      </button>
    </section>
  );
}
