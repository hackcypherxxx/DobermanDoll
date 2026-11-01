import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";

export default function NotFoundPage() {
  return (
    <Container className="py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-blush-500">404</p>
      <h1 className="mt-4 font-display text-5xl">Page not found</h1>
      <p className="mt-4 text-sm text-charcoal-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block text-sm text-blush-600 underline-offset-4 hover:underline"
      >
        Return home
      </Link>
    </Container>
  );
}
