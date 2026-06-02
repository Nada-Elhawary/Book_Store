"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  availableCopies: number;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [availableCopies, setAvailableCopies] = useState<number>(1);

  const { user } = useAuthStore();

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
    if (user?.role === "admin") {
      fetchBooks();
    }
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setImage("");
    setAvailableCopies(1);
    setEditingBook(null);
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setTitle(book.title);
      setAuthor(book.author);
      setImage(book.image || "");
      setAvailableCopies(book.availableCopies);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.patch(`/api/books/${editingBook._id}`, { title, author, image, availableCopies });
        toast.success("Book updated successfully");
      } else {
        await api.post("/api/books", { title, author, image, availableCopies });
        toast.success("Book added successfully");
      }
      setIsDialogOpen(false);
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save book");
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/api/books/${id}`);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete book");
    }
  };

  if (user?.role !== "admin") return <div className="p-8">Access Denied</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Books</h2>
          <p className="text-muted-foreground mt-2">Add, edit, or delete books in the catalog.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveBook} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input value={author} onChange={e => setAuthor(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input value={image} onChange={e => setImage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Copies</label>
                <Input type="number" min="0" value={availableCopies} onChange={e => setAvailableCopies(Number(e.target.value))} required />
              </div>
              <Button type="submit" className="w-full">{editingBook ? "Save Changes" : "Add Book"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                      <img src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"} alt={book.title} className="h-full w-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.availableCopies}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(book)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
