import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles, HeartHandshake, Truck, Star, Package } from "lucide-react";
import { SITE_IMAGES } from "@/lib/images";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-background">
      
      {/* ============ 01. HERO ============ */}
      <section className="page-container py-12 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[42fr_58fr] lg:gap-16">
          <div className="order-2 flex flex-col items-start gap-7 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">
                Artfully Crafted
              </span>
            </div>
            <h1 className="font-display text-4xl leading-[0.95] text-text sm:text-5xl lg:text-[76px]">
              Made to Be<br />Loved.<br />
              <span className="italic text-rose-dark">Treasured Forever.</span>
            </h1>
            <p className="max-w-md text-sm md:text-[15px] leading-relaxed text-text-secondary">
              Discover beautifully detailed reborn dolls, created to bring warmth, wonder, and a little extra love into your world.
            </p>
            <div className="flex w-full flex-col items-start gap-4 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
              <Link
                to="/shop"
                className="group flex h-[52px] w-full sm:w-auto items-center justify-center gap-3 bg-rose-dark px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose"
              >
                Explore the Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/about" className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary underline-offset-4 hover:text-text hover:underline">
                Our Story
              </Link>
            </div>
          </div>

          <div className="relative order-1 w-full overflow-hidden bg-cream lg:order-2">
            <div className="aspect-[4/5] w-full lg:aspect-auto lg:h-[680px]">
              <img src={SITE_IMAGES.hero.url} alt={SITE_IMAGES.hero.alt} className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-6 right-6 bg-surface/95 px-5 py-3 backdrop-blur-md md:bottom-8 md:right-8 md:px-7 md:py-4">
              <p className="font-display text-sm italic text-text md:text-base">
                &ldquo;Soft, lifelike touch — just like a real baby.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02. MARQUEE ============ */}
      <section className="overflow-hidden border-y border-border bg-surface py-5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-10 px-5 md:gap-14 md:px-7">
              <span className="font-display text-xl italic text-text md:text-2xl">Lifelike Detail</span>
              <span className="h-1 w-1 rounded-full bg-rose" />
              <span className="font-display text-xl italic text-text md:text-2xl">Handcrafted Care</span>
              <span className="h-1 w-1 rounded-full bg-rose" />
              <span className="font-display text-xl italic text-text md:text-2xl">Forever Treasured</span>
              <span className="h-1 w-1 rounded-full bg-rose" />
            </div>
          ))}
        </div>
      </section>

      {/* ============ 03. TRUST STRIP ============ */}
      <section className="bg-surface py-10">
        <div className="page-container grid grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-border">
          <TrustItem icon={<Sparkles />} title="Carefully Crafted" desc="Beautifully detailed" />
          <TrustItem icon={<ShieldCheck />} title="Secure Ordering" desc="Shop with confidence" />
          <TrustItem icon={<HeartHandshake />} title="Customer Care" desc="We're here to help" />
          <TrustItem icon={<Truck />} title="Order Updates" desc="Stay informed" />
        </div>
      </section>

      {/* ============ 04. VISUAL COLLECTIONS ============ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="page-container">
          <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">Curated For You</span>
            <h2 className="mt-4 font-display text-3xl text-text md:text-5xl">Find Your Little Treasure</h2>
          </div>

          <div className="grid gap-5 md:gap-6 lg:grid-cols-12 lg:grid-rows-[1fr_1fr] lg:auto-rows-fr">
            {/* Large card */}
            <Link to="/shop" className="group relative block overflow-hidden lg:col-span-7 lg:row-span-2 bg-cream aspect-[4/5] lg:aspect-auto">
              <img src={SITE_IMAGES.collection1.url} alt={SITE_IMAGES.collection1.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/80">Collection Nº 01</p>
                <h3 className="mt-2 font-display text-2xl text-white md:text-4xl">Full Body Silicone</h3>
                <p className="mt-2 max-w-md text-sm text-white/80">Beautifully detailed silicone companions.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Shop Collection <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>

            {/* Small card 1 */}
            <Link to="/shop" className="group relative block overflow-hidden lg:col-span-5 bg-cream aspect-[16/10] lg:aspect-auto">
              <img src={SITE_IMAGES.collection2.url} alt={SITE_IMAGES.collection2.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/80">Collection Nº 02</p>
                <h3 className="mt-1 font-display text-xl text-white md:text-2xl">Sleeping Babies</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Shop <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>

            {/* Small card 2 */}
            <Link to="/shop" className="group relative block overflow-hidden lg:col-span-5 bg-cream aspect-[16/10] lg:aspect-auto">
              <img src={SITE_IMAGES.collection3.url} alt={SITE_IMAGES.collection3.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/80">Collection Nº 03</p>
                <h3 className="mt-1 font-display text-xl text-white md:text-2xl">Awake & Smiling</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Shop <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 05. THE ARTISAN PROCESS ============ */}
      <section className="bg-background py-20 md:py-28 border-b border-border">
        <div className="page-container grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">The Craft</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-text md:text-5xl">
              The Art of the<br/><span className="italic text-rose-dark">Reborn Baby</span>
            </h2>
            <div className="mt-8 space-y-6 text-sm md:text-[15px] leading-relaxed text-text-secondary">
              <p>
                Creating a lifelike reborn doll is a labor of love that takes weeks to complete. It is not simply a toy, but a piece of highly detailed art.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush text-rose-dark"><Star className="h-4 w-4" /></div>
                  <div>
                    <h4 className="font-bold text-text">Hand-Rooted Hair</h4>
                    <p className="mt-1">Each strand of mohair is inserted individually using a fine needle to mimic natural hair growth.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush text-rose-dark"><Sparkles className="h-4 w-4" /></div>
                  <div>
                    <h4 className="font-bold text-text">Multi-Layered Painting</h4>
                    <p className="mt-1">Dozens of translucent layers of Genesis heat-set paint are baked on to create realistic skin tones.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush text-rose-dark"><Package className="h-4 w-4" /></div>
                  <div>
                    <h4 className="font-bold text-text">Perfectly Weighted</h4>
                    <p className="mt-1">Filled with fine glass beads and polyfill, they are weighted to feel exactly like holding a real infant.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream md:aspect-square">
             <img src={SITE_IMAGES.story.url} alt={SITE_IMAGES.story.alt} className="h-full w-full object-cover" />
             <div className="absolute inset-0 border border-black/5 mix-blend-overlay"></div>
          </div>
        </div>
      </section>

      {/* ============ 06. LOOKBOOK GALLERY ============ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="page-container">
          <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">The Lookbook</span>
            <h2 className="mt-4 font-display text-3xl text-text md:text-5xl">Capturing the Details</h2>
            <p className="mt-4 max-w-lg text-sm text-text-secondary">Explore the delicate features and beautiful outfits of our little treasures.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {SITE_IMAGES.lookbook.map((img, i) => (
              <div key={i} className="aspect-[3/4] w-full overflow-hidden bg-cream">
                 <img src={img.url} alt={img.alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 07. PHILOSOPHY QUOTE ============ */}
      <section className="border-y border-border bg-cream py-20 md:py-28">
        <div className="page-container text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose">Our Philosophy</span>
          <blockquote className="mx-auto mt-8 max-w-3xl font-display text-2xl italic leading-[1.15] text-text md:text-4xl lg:text-[52px]">
            &ldquo;Made slowly, loved forever.<br className="hidden md:block" /> Each doll is a small act of devotion.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-text-secondary/40" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">The Dreambaby Promise</span>
            <span className="h-px w-10 bg-text-secondary/40" />
          </div>
        </div>
      </section>

      {/* ============ 08. OUR PROMISE ============ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="page-container">
          <div className="mb-12 md:mb-20 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">Why Choose Us</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl text-text">Made with Care,<br />Chosen with Love</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-16">
            <WhyItem number="01" title="Thoughtful Details" desc="From delicate features to carefully selected outfits, every detail deserves attention." />
            <WhyItem number="02" title="Beautifully Presented" desc="Each doll is presented with care, making every unboxing feel special." />
            <WhyItem number="03" title="A Treasured Companion" desc="Discover a little treasure to celebrate, collect, or give to someone special." />
          </div>
        </div>
      </section>

      {/* ============ 09. FAQ ============ */}
      <section className="bg-background py-20 md:py-28">
        <div className="page-container max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">Questions</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl text-text">Frequently Asked</h2>
          </div>
          <div className="border-t border-border">
            <FaqItem 
              question="What is a reborn doll?" 
              answer="A reborn doll is a vinyl or silicone doll that has been transformed by an artist to resemble a human infant with as much realism as possible." 
              isOpen={openFaq === 0} 
              onClick={() => setOpenFaq(openFaq === 0 ? null : 0)} 
            />
            <FaqItem 
              question="What materials are your dolls made from?" 
              answer="Our dolls are crafted from high-quality silicone or vinyl, carefully painted and assembled to achieve a lifelike appearance." 
              isOpen={openFaq === 1} 
              onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} 
            />
            <FaqItem 
              question="How do I place an order?" 
              answer="Simply browse our collection, add your chosen doll to the cart, and proceed through our guest checkout process." 
              isOpen={openFaq === 2} 
              onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} 
            />
            <FaqItem 
              question="What payment methods are available?" 
              answer="We accept major credit cards and secure online payments. Manual payment instructions are also provided for specific order types." 
              isOpen={openFaq === 3} 
              onClick={() => setOpenFaq(openFaq === 3 ? null : 3)} 
            />
          </div>
        </div>
      </section>

      {/* ============ 10. NEWSLETTER ============ */}
      <section className="bg-rose-dark py-20 md:py-28">
        <div className="page-container max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Stay Close</span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-white">A Little Love in Your Inbox</h2>
          <p className="mt-3 md:mt-4 text-sm md:text-[15px] text-white/80">
            Be the first to discover new arrivals, special collections, and little treasures.
          </p>
          <form className="mt-8 md:mt-10 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="h-12 flex-1 border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none"
            />
            <button type="button" className="h-12 bg-rose px-8 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-rose-dark">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

// ============ SUB-COMPONENTS ============

function TrustItem({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <span className="text-rose-dark mb-3 md:mb-4 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:stroke-[1.5]">{icon}</span>
      <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-text">{title}</h4>
      <p className="mt-1 text-[11px] md:text-xs text-text-secondary">{desc}</p>
    </div>
  );
}

function WhyItem({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="border-t border-border pt-6">
      <span className="font-display text-2xl italic text-rose-dark/50">{number}</span>
      <h3 className="mt-4 font-display text-2xl text-text">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{desc}</p>
    </div>
  );
}

function FaqItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border py-5 md:py-6">
      <button onClick={onClick} className="flex w-full items-center justify-between text-left group">
        <span className="font-display text-lg md:text-xl text-text group-hover:text-rose-dark transition-colors pr-4">{question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-text-secondary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-3 md:mt-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-text-secondary max-w-3xl">{answer}</p>
        </div>
      </div>
    </div>
  );
}
