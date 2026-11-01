import { Accordion } from "@/components/common/Accordion";

const FAQ_IMAGE = "https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2000&auto=format&fit=crop";

export default function FAQPage() {
  return (
    <div className="bg-background pb-24">
      {/* Hero */}
      <section className="relative flex h-[35vh] w-full items-center justify-center overflow-hidden bg-cream md:h-[40vh]">
        <img src={FAQ_IMAGE} alt="FAQ" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Support</span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-6xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="page-container mt-16 md:mt-24 max-w-4xl mx-auto">
        <div className="border-t border-border">
          <Accordion title="What is a reborn doll?">
            <p>A reborn doll is a vinyl or silicone doll that has been transformed by an artist to resemble a human infant with as much realism as possible. They are often weighted to feel like a real baby when held.</p>
          </Accordion>
          <Accordion title="What materials are your dolls made from?">
            <p>Our dolls are crafted from high-quality, soft platinum silicone or premium vinyl. They are carefully hand-painted and assembled to achieve a lifelike appearance, complete with rooted hair and realistic detailing.</p>
          </Accordion>
          <Accordion title="How do I place an order?">
            <p>Simply browse our collection, add your chosen doll to the cart, and proceed through our guest checkout process. No account creation is required.</p>
          </Accordion>
          <Accordion title="What payment methods are available?">
            <p>We accept major credit cards and secure online payments. For certain orders, manual payment instructions (such as bank transfer) are also provided after your order is reviewed.</p>
          </Accordion>
          <Accordion title="How long does shipping take?">
            <p>Shipping times vary based on your location. Once your order is dispatched, you will receive an email with tracking information. Domestic orders typically arrive within 3-5 business days after dispatch.</p>
          </Accordion>
          <Accordion title="Can I track my order?">
            <p>Yes. Once your order is placed, you can use the secure tracking link provided in your confirmation email, or visit our Order Tracking page.</p>
          </Accordion>
          <Accordion title="What should I do if I need help with my order?">
            <p>Please contact our customer care team through the <a href="/contact" className="text-rose-dark underline">Contact page</a>, and we will be happy to assist you.</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
