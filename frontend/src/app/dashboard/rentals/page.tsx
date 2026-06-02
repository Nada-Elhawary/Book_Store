"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Book } from "lucide-react";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody
} from "@/components/ui/table";

interface Order {
  _id: string;
  status: string;
  book: {
    _id: string;
    title: string;
    author: string;
    image?: string;
  };
  createdAt: string;
}

export default function ActiveRentalsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/orders/my-orders");
      setOrders(data.data);
    } catch (error) {
      toast.error("Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReturn = async (orderId: string) => {
    setReturningId(orderId);
    try {
      await api.put(`/api/orders/return/${orderId}`);
      toast.success("Book returned successfully!");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Active Rentals</h2>
        <p className="text-muted-foreground mt-2">
          View your currently rented books and return them.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
          <CardDescription>A list of all books you have rented.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed">
              <Book className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No rentals found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">You haven't rented any books yet. Visit the catalog to explore our collection.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Book</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Rented</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                            <img 
                              src={order.book?.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"} 
                              alt={order.book?.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium line-clamp-1">{order.book?.title}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">by {order.book?.author}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === "rented" ? "default" : "secondary"} className={order.status === "rented" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}>
                          {order.status === "rented" ? "Active" : "Returned"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === "rented" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={returningId === order._id}
                            onClick={() => handleReturn(order._id)}
                            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
                          >
                            {returningId === order._id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Return Book
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
