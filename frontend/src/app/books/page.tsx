"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  availableCopies: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rentingId, setRentingId] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/api/books");
      setBooks(data.data);
    } catch (error) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRent = async (bookId: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to rent a book.");
      router.push("/login");
      return;
    }
    setRentingId(bookId);
    try {
      await api.post(`/api/orders/rent/${bookId}`);
      toast.success("Book rented successfully!");
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to rent book");
    } finally {
      setRentingId(null);
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />

      <main className="flex-1 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Book Catalog</h2>
              <p className="text-muted-foreground mt-2">
                Browse our collection and rent your next favorite book.
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books..."
                className="pl-8 bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground bg-card rounded-lg border border-border">
              No books found matching your search.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <Card key={book._id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 group bg-card">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <img
                      src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"}
                      alt={book.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="pt-4">
                    <CardTitle className="line-clamp-1 text-lg">{book.title}</CardTitle>
                    <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-2">
                    <Badge
                      variant={book.availableCopies > 0 ? "default" : "secondary"}
                      className={book.availableCopies > 0 ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                    >
                      {book.availableCopies > 0 ? `${book.availableCopies} Available` : "Out of Stock"}
                    </Badge>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    <Button
                      className="w-full transition-all duration-300 shadow-sm"
                      disabled={book.availableCopies <= 0 || rentingId === book._id}
                      onClick={() => handleRent(book._id)}
                      variant={book.availableCopies > 0 ? "default" : "secondary"}
                    >
                      {rentingId === book._id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      {book.availableCopies > 0 ? "Rent Book" : "Unavailable"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
