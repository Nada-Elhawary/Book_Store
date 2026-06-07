"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Library, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { motion, Variants } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PublicHeader />

      <main className="flex-1 pt-16">
        {/* ── Hero Section ── */}
        <section className="w-full py-20 md:py-28 lg:py-32 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

          <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn} className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    NexusBooks 2.0 is live
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
                    The Premium <br className="hidden lg:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">Book Rental</span> Experience
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Access thousands of premium titles instantly. Manage rentals, track returns, and discover your next great read with our enterprise-grade library platform.
                  </p>
                </motion.div>
                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                  <Link href="/books">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full group w-full sm:w-auto shadow-lg shadow-primary/20 transition-all hover:scale-105">
                      Explore Catalog
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  {mounted && isAuthenticated ? (
                    <Link href="/dashboard">
                      <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5 w-full sm:w-auto transition-all hover:scale-105">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5 w-full sm:w-auto transition-all hover:scale-105">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </motion.div>
                <motion.div variants={fadeIn} className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p>Trusted by <span className="font-semibold text-foreground">10,000+</span> readers</p>
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative hidden lg:block h-[600px] w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Floating Book 1 */}
                <motion.div 
                  className="absolute top-10 left-10 w-[220px] h-[320px] rounded-lg overflow-hidden shadow-2xl border border-border/50 z-20"
                  animate={{ y: [0, -20, 0], rotate: [-6, -4, -6] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" alt="Clean Code" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </motion.div>

                {/* Floating Book 2 (Center) */}
                <motion.div 
                  className="absolute top-32 left-1/2 -translate-x-1/2 w-[250px] h-[360px] rounded-lg overflow-hidden shadow-2xl border border-primary/30 z-30"
                  animate={{ y: [0, -30, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <img src="https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop" alt="Design Patterns" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                </motion.div>

                {/* Floating Book 3 */}
                <motion.div 
                  className="absolute top-20 right-4 w-[200px] h-[290px] rounded-lg overflow-hidden shadow-xl border border-border/50 z-10"
                  animate={{ y: [0, -15, 0], rotate: [12, 10, 12] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" alt="JavaScript" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </motion.div>
                
                {/* Decorative backdrop glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[80px] rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Logos/Social Proof Section ── */}
        <section className="py-10 border-y border-border/40 bg-muted/20">
          <div className="container mx-auto px-4 text-center max-w-7xl">
            <p className="text-sm font-medium text-muted-foreground mb-6">FEATURED IN AND TRUSTED BY</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Forbes', 'TechCrunch', 'Wired', 'The New York Times', 'Medium'].map((brand) => (
                <span key={brand} className="text-xl md:text-2xl font-bold font-serif tracking-tighter">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section className="w-full py-24 bg-background relative">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <motion.div 
              className="text-center mb-16 max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to read more</h2>
              <p className="text-muted-foreground text-lg">We've completely reimagined the book rental experience. No more waiting, no more late fees, just pure reading.</p>
            </motion.div>

            <motion.div 
              className="grid gap-8 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {[
                { icon: Library, title: "Vast Collection", desc: "Access over 100,000+ premium titles across various genres, carefully curated for professionals." },
                { icon: Zap, title: "Instant Access", desc: "Digital-first renting means zero shipping time. Tap a button and start reading immediately." },
                { icon: ShieldCheck, title: "Enterprise Security", desc: "Your reading data, notes, and highlights are encrypted and securely stored." }
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeIn} className="flex flex-col items-center space-y-4 text-center p-8 rounded-3xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all hover:-translate-y-1">
                  <div className="p-4 bg-background shadow-sm rounded-2xl mb-2">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── How it Works Section ── */}
        <section className="w-full py-24 bg-secondary/20 border-y border-border/40 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border">
                  <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop" alt="Reading a book" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                {/* Floating UI Element */}
                <div className="absolute -bottom-8 -right-8 bg-background p-6 rounded-2xl shadow-xl border border-border/50 w-64 hidden md:block">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-primary/20 p-2 rounded-full"><CheckCircle2 className="w-6 h-6 text-primary" /></div>
                    <div>
                      <p className="text-sm font-bold">Book Returned</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[100%]"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="space-y-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Seamless reading, <br/><span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">simplified.</span></h2>
                  <p className="text-muted-foreground text-lg">We eliminated the friction of traditional libraries. Here is how you can start reading in under two minutes.</p>
                </div>

                <div className="space-y-8">
                  {[
                    { step: "01", title: "Create your profile", desc: "Sign up in seconds and personalize your reading preferences." },
                    { step: "02", title: "Browse the catalog", desc: "Search through our extensive, constantly updated collection of books." },
                    { step: "03", title: "Rent and read", desc: "One click to rent. Read on any device, anywhere, anytime." }
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeIn} className="flex gap-4">
                      <div className="text-2xl font-bold text-primary/30 font-serif pt-1">{item.step}</div>
                      <div>
                        <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div variants={fadeIn}>
                  <Link href={mounted && isAuthenticated ? "/dashboard" : "/register"}>
                    <Button size="lg" className="rounded-full px-8 mt-4 shadow-lg shadow-primary/20">
                      {mounted && isAuthenticated ? "Go to Dashboard" : "Start Your Journey"}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="w-full py-32 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-4xl text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to elevate your <br/>reading experience?
              </motion.h2>
              <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of professionals who have already upgraded their library. Your first book is on us.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href={mounted && isAuthenticated ? "/dashboard" : "/register"}>
                  <Button size="lg" className="h-14 px-10 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/20 transition-transform hover:scale-105">
                    {mounted && isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
                  </Button>
                </Link>
                <Link href="/books">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full bg-background w-full sm:w-auto transition-transform hover:scale-105">
                    Browse Books First
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
