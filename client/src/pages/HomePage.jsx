import HeroSection from '../components/landing/HeroSection';
import IdentifySection from '../components/landing/IdentifySection';
import SolutionsSection from '../components/landing/SolutionsSection';
import SpotifySection from '../components/landing/SpotifySection';
import YouTubeSection from '../components/landing/YouTubeSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';

export default function HomePage() {
  return (
    <>
      {/* Atención: primera impresión + propuesta de valor */}
      <HeroSection />
      {/* Identificación: reconocer el problema */}
      <IdentifySection />
      {/* Solución: caminos diferenciados (asesorías / libros / ambas) */}
      <SolutionsSection />
      {/* Contenido de valor: podcast y videos */}
      <SpotifySection />
      <YouTubeSection />
      {/* Prueba social */}
      <TestimonialsSection />
      {/* Resolver dudas + aviso responsable */}
      <FAQSection />
      {/* Acción final */}
      <CTASection />
    </>
  );
}
