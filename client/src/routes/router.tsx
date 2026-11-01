import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";

// Layouts (eager — needed on every page)
import { StoreLayout } from "@/components/layout/StoreLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Lazy-loaded pages — each becomes its own chunk
const HomePage = lazy(() => import("@/pages/HomePage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"));
const OrderTrackingPage = lazy(() => import("@/pages/OrderTrackingPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const ReviewsPage = lazy(() => import("@/pages/ReviewsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const AdminLoginPage = lazy(() => import("@/pages/admin/LoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/OrdersPage"));
const AdminOrderDetailPage = lazy(() => import("@/pages/admin/OrderDetailPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const AdminProductFormPage = lazy(() => import("@/pages/admin/ProductFormPage"));
const AdminCategoriesPage = lazy(() => import("@/pages/admin/CategoriesPage"));
const AdminCouponsPage = lazy(() => import("@/pages/admin/CouponsPage"));
const AdminReviewsPage = lazy(() => import("@/pages/admin/ReviewsPage"));

/** Minimal loading fallback while a page chunk loads. */
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-dark border-t-transparent" />
    </div>
  );
}

/** Wrap a lazy page in Suspense. */
function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  // ================= STOREFRONT =================
  {
    element: <StoreLayout />,
    children: [
      { path: "/", element: withSuspense(<HomePage />) },
      { path: "/shop", element: withSuspense(<ShopPage />) },
      { path: "/product/:slug", element: withSuspense(<ProductPage />) },
      { path: "/cart", element: withSuspense(<CartPage />) },
      { path: "/checkout", element: withSuspense(<CheckoutPage />) },
      { path: "/order/success", element: withSuspense(<OrderSuccessPage />) },
      { path: "/track", element: withSuspense(<OrderTrackingPage />) },
      { path: "/track/:token", element: withSuspense(<OrderTrackingPage />) },
      { path: "/about", element: withSuspense(<AboutPage />) },
      { path: "/contact", element: withSuspense(<ContactPage />) },
      { path: "/faq", element: withSuspense(<FAQPage />) },
      { path: "/reviews", element: withSuspense(<ReviewsPage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },

  // ================= ADMIN LOGIN =================
  { path: "/admin/login", element: withSuspense(<AdminLoginPage />) },

  // ================= PROTECTED ADMIN ROUTES =================
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: withSuspense(<AdminDashboardPage />) },
          { path: "orders", element: withSuspense(<AdminOrdersPage />) },
          { path: "orders/:id", element: withSuspense(<AdminOrderDetailPage />) },
          { path: "products", element: withSuspense(<AdminProductsPage />) },
          { path: "products/new", element: withSuspense(<AdminProductFormPage />) },
          { path: "products/:id/edit", element: withSuspense(<AdminProductFormPage />) },
          { path: "categories", element: withSuspense(<AdminCategoriesPage />) },
          { path: "coupons", element: withSuspense(<AdminCouponsPage />) },
          { path: "reviews", element: withSuspense(<AdminReviewsPage />) },
        ],
      },
    ],
  },
]);
