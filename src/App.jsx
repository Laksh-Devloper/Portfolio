import { Suspense } from 'react';
import Scene3D from './components/Scene3D';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

import { useEffect } from 'react';
import Lenis from 'lenis';
import './App.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="app">
        {/* 3D Background */}
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main>
          <Hero />
          <About />
          <Experience />
          <Education />
          <Skills />
          <Projects />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
