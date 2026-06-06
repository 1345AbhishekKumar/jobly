import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { Testimonial } from "@/components/homepage/Testimonial";
import { BottomCTA } from "@/components/homepage/BottomCTA";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonial />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
