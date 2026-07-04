import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageLoader } from "@/components/ui/PageLoader";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { GithubSection } from "@/components/sections/GithubSection";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

function App() {
  return (
    <SmoothScroll>
      <PageLoader />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />

      <main>
        <Hero />
        <QuoteSection />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <GithubSection />
        <Education />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />
    </SmoothScroll>
  );
}

export default App;
