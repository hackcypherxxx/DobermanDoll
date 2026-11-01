import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminListOrders } from "@/api/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function AdminOrdersPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminListOrders,
  });

  const [search, setSearch] = useState("");

  if (isLoading) return <div className="p-8 text-center text-text-secondary animate-pulse">Loading orders...</div>;
  if (isError || !orders) return <div className="p-8 text-center text-red-600">Failed to load orders.</div>;

  const filteredOrders = orders.filter((o) => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-display text-3xl text-text">Orders</h1>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search order #, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full border border-border bg-surface pl-9 pr-3 text-sm text-text focus:border-rose-dark focus:outline-none"
          />
        </div>
      </div>

      <div className="border border-border bg-surface">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 border-b border-border bg-cream/50 p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">
          <div className="col-span-1">Order</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {/* List */}
        <div className="divide-y divide-border">
          {filteredOrders.map((order) => (
            <Link 
              key={order._id} 
              to={`/admin/orders/${order._id}`}
              className="flex flex-col md:grid md:grid-cols-6 gap-2 md:gap-4 p-4 hover:bg-cream/30 transition-colors group"
            >
              <div className="md:col-span-1 flex justify-between md:block">
                <span className="font-bold text-text md:font-medium text-sm">{order.orderNumber}</span>
                <span className="md:hidden text-sm font-medium">{formatCurrency(order.total)}</span>
              </div>
              
              <div className="md:col-span-2 flex flex-col justify-center">
                <span className="text-sm text-text">{order.customer?.name || "Unknown"}</span>
                <span className="text-xs text-text-secondary">{order.customer?.email}</span>
              </div>

              <div className="hidden md:flex md:col-span-1 items-center text-xs text-text-secondary">
                {formatDate(order.createdAt)}
              </div>
              
              <div className="hidden md:flex md:col-span-1 items-center justify-end font-medium text-sm">
                {formatCurrency(order.total)}
              </div>

              <div className="flex items-center justify-between md:justify-end md:col-span-1 mt-2 md:mt-0">
                <div className="flex gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${
                    order.paymentStatus === 'PAID' ? 'border-success text-success bg-success/5' : 
                    order.paymentStatus === 'UNPAID' ? 'border-rose text-rose bg-rose/5' : 'border-border text-text-secondary'
                  }`}>
                    {order.paymentStatus.replace("_", " ")}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-text-secondary md:hidden" />
              </div>
            </Link>
          ))}
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-sm text-text-secondary">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
