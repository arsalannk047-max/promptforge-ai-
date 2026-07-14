import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { NewsletterCTA } from "@/components/landing/newsletter-cta";
import { Footer } from "@/components/landing/footer";
import { SplashIntro } from "@/components/landing/splash-intro";

export default function HomePage() {
  return (
    <>
      <SplashIntro />
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
