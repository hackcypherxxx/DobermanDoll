import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ title, children, defaultOpen = false }: { title: string, children: ReactNode, defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border py-5 md:py-6">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left group">
        <span className="font-display text-lg md:text-2xl text-text group-hover:text-rose-dark transition-colors pr-4">
          {title}
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="text-sm md:text-[15px] leading-relaxed text-text-secondary max-w-3xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
