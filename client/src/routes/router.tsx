import { createBrowserRouter } from "react-router-dom";

// Layouts & Protection
import { StoreLayout } from "@/components/layout/StoreLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Storefront Pages
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import ReviewsPage from "@/pages/ReviewsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin Pages
import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminOrdersPage from "@/pages/admin/OrdersPage";
import AdminOrderDetailPage from "@/pages/admin/OrderDetailPage";
import AdminProductsPage from "@/pages/admin/ProductsPage";
import AdminProductFormPage from "@/pages/admin/ProductFormPage";
import AdminCategoriesPage from "@/pages/admin/CategoriesPage";
import AdminCouponsPage from "@/pages/admin/CouponsPage";
import AdminReviewsPage from "@/pages/admin/ReviewsPage";

export const router = createBrowserRouter([
  // ================= STOREFRONT =================
  {
    element: <StoreLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/shop", element: <ShopPage /> },
      { path: "/product/:slug", element: <ProductPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/order/success", element: <OrderSuccessPage /> },
      { path: "/track", element: <OrderTrackingPage /> },
      { path: "/track/:token", element: <OrderTrackingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/reviews", element: <ReviewsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // ================= ADMIN LOGIN =================
  { path: "/admin/login", element: <AdminLoginPage /> },

  // ================= PROTECTED ADMIN ROUTES =================
  {
    element: <ProtectedRoute />, // Checks auth cookie
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "orders/:id", element: <AdminOrderDetailPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "products/new", element: <AdminProductFormPage /> },
          { path: "products/:id/edit", element: <AdminProductFormPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "coupons", element: <AdminCouponsPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
        ],
      },
    ],
  },
]);
