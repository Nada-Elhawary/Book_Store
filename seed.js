const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Book = require("./models/Book");
const connectDB = require("./config/db");

const mockBooks = [
  { title: "The Pragmatic Programmer", author: "Andrew Hunt and David Thomas", availableCopies: 5, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" },
  { title: "Clean Code", author: "Robert C. Martin", availableCopies: 3, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { title: "Design Patterns", author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", availableCopies: 2, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop" },
  { title: "Refactoring", author: "Martin Fowler", availableCopies: 4, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", availableCopies: 7, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", availableCopies: 6, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop" },
  { title: "You Don't Know JS", author: "Kyle Simpson", availableCopies: 10, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", availableCopies: 1, image: "https://images.unsplash.com/photo-1629196914546-9908da2246b1?q=80&w=800&auto=format&fit=crop" },
  { title: "System Design Interview", author: "Alex Xu", availableCopies: 8, image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop" },
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", availableCopies: 12, image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", availableCopies: 2, image: "https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?q=80&w=800&auto=format&fit=crop" },
  { title: "Code Complete", author: "Steve McConnell", availableCopies: 4, image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop" },
  { title: "Head First Design Patterns", author: "Eric Freeman", availableCopies: 5, image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop" },
  { title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson", availableCopies: 3, image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=800&auto=format&fit=crop" },
  { title: "Grokking Algorithms", author: "Aditya Bhargava", availableCopies: 9, image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop" },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("Connected to DB, clearing existing books...");
    await Book.deleteMany(); // Clear existing books
    
    console.log("Inserting new mock books...");
    await Book.insertMany(mockBooks);
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
