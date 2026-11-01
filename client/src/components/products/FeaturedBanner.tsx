import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  imageSrc?: string;
  href: string;
  bgColor?: string;
}

export function FeaturedBanner({
  title,
  description,
  imageSrc,
  href,
  bgColor = "bg-pastel-pink",
}: Props) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] ${bgColor} mx-4 my-16 md:mx-8 lg:mx-auto lg:max-w-7xl`}>
      <div className="relative z-10 flex flex-col items-start gap-4 px-8 py-16 md:w-3/5 md:px-16 md:py-24 lg:py-32">
        <h2 className="font-display text-4xl font-bold leading-[1.1] text-text md:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="max-w-md text-base text-text-secondary md:text-lg">
          {description}
        </p>
        <Link
          to={href}
          className="mt-4 inline-flex h-12 items-center rounded-full bg-rose-dark px-10 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose"
        >
          Shop Now
        </Link>
      </div>
      
      {imageSrc && (
        <div className="absolute bottom-0 right-0 hidden h-full w-1/2 md:block">
           <div className="relative h-full w-full">
             <img
               src={imageSrc}
               alt={title}
               className="h-full w-full object-cover object-left-top mix-blend-multiply"
               loading="lazy"
             />
           </div>
        </div>
      )}
    </div>
  );
}
