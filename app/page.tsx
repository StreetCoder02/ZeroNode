import LandingNavbar from "@/components/landing/landing-navbar";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import DemoSection from "@/components/landing/demo-section";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <Footer />
      </div>
    </main>
  );
}
