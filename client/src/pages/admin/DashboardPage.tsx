import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/api/dashboard";
import { ShoppingBag, Package, DollarSign, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) return <div className="animate-pulse space-y-6"><div className="h-32 bg-surface" /><div className="h-64 bg-surface" /></div>;
  if (isError || !data) return <div className="text-red-600">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-8">
      
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-border bg-surface p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-rose-dark" />
          </div>
          <p className="mt-4 font-display text-3xl text-text">{formatCurrency(data.totalRevenue || 0)}</p>
        </div>
        
        <div className="border border-border bg-surface p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-rose-dark" />
          </div>
          <p className="mt-4 font-display text-3xl text-text">{data.totalOrders || 0}</p>
        </div>

        <div className="border border-border bg-surface p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Total Products</span>
            <Package className="h-4 w-4 text-rose-dark" />
          </div>
          <p className="mt-4 font-display text-3xl text-text">{data.totalProducts || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="font-display text-xl text-text">Recent Orders</h2>
          <Link to="/admin/orders" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-dark hover:underline">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <ul className="divide-y divide-border">
          {data.recentOrders?.map((order) => (
            <li key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-cream/50 transition-colors">
              <div>
                <p className="font-medium text-text text-sm">{order.orderNumber || "Unknown Order"}</p>
                <p className="text-xs text-text-secondary mt-1">
                  {order.customer?.name || "Unknown Customer"} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <span className="text-sm font-medium tabular-nums text-text">{formatCurrency(order.total || 0)}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${
                  order.paymentStatus === 'PAID' ? 'border-success text-success bg-success/5' : 
                  order.paymentStatus === 'UNPAID' ? 'border-rose text-rose bg-rose/5' : 'border-border text-text-secondary'
                }`}>
                  {(order.paymentStatus || "UNKNOWN").replace("_", " ")}
                </span>
              </div>
            </li>
          ))}
          {(!data.recentOrders || data.recentOrders.length === 0) && (
            <li className="p-6 text-sm text-text-secondary">No recent orders found.</li>
          )}
        </ul>
      </div>

    </div>
  );
}
