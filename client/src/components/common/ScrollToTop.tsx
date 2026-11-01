import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the top of the page whenever the route changes.
 *
 * Uses useLayoutEffect (fires before paint) + multiple scroll strategies
 * to guarantee the page resets, even on mobile and inside overflow containers.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // 1. Reset any stuck body overflow left behind by a modal
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // 2. Scroll all possible scroll targets
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 3. Reset inner scroll containers (e.g., Admin <main>)
    const resetInner = () => {
      document
        .querySelectorAll<HTMLElement>("[data-scroll-container]")
        .forEach((el) => {
          el.scrollTop = 0;
        });
    };
    resetInner();

    // 4. Fallback: if the new page's content mounts after paint,
    //    scroll again on the next frame to make sure we're at the top.
    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      resetInner();
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
