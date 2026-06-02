"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Loader2, Book, Users, Activity, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// --- Types ---
interface Order {
  _id: string;
  status: string;
  book?: {
    _id: string;
    title: string;
    author: string;
    image?: string;
  };
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface BookType {
  _id: string;
}

interface UserType {
  _id: string;
}

// --- Admin Dashboard View ---
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    activeRentals: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, booksRes, ordersRes] = await Promise.all([
          api.get("/api/users"),
          api.get("/api/books"),
          api.get("/api/orders"),
        ]);
        
        const orders = ordersRes.data.data;
        const active = orders.filter((o: Order) => o.status === "active" || o.status === "rented").length;

        setStats({
          totalUsers: usersRes.data.data?.length || 0,
          totalBooks: booksRes.data.data?.length || 0,
          totalOrders: orders.length,
          activeRentals: active,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        <p className="text-muted-foreground mt-2">
          Monitor your platform's activity, user base, and catalog health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">Titles in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeRentals}</div>
            <p className="text-xs text-muted-foreground mt-1">Books currently out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lifetime Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">All historical rentals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>Latest rentals globally</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Book className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No recent activity.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center gap-4 group border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <span className="text-primary">{order.user?.name}</span> rented <span className="font-semibold">"{order.book?.title}"</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        (order.status === 'rented' || order.status === 'active') ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {order.status === 'rented' || order.status === 'active' ? 'Active' : 'Returned'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Regular User Dashboard View ---
function UserDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders/my-orders");
        setOrders(data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const activeRentals = orders.filter((o) => o.status === "rented" || o.status === "active");
  const pastRentals = orders.filter((o) => o.status === "returned");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-2">
          Manage your active rentals and view your history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : activeRentals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently borrowed books</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned Books</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : pastRentals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Books you have read</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest book rentals</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Book className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No recent activity.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center gap-4 group">
                    <div className="h-14 w-10 rounded overflow-hidden flex-shrink-0 bg-muted border border-border">
                      <img 
                        src={order.book?.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"} 
                        alt={order.book?.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none line-clamp-1 group-hover:text-primary transition-colors">{order.book?.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">By {order.book?.author}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        (order.status === 'rented' || order.status === 'active') ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {order.status === 'rented' || order.status === 'active' ? 'Rented' : 'Returned'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Main Page Wrapper ---
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}
