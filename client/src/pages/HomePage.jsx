import { usePageMeta } from '../hooks/usePageMeta';
import HeroSection from '../components/landing/HeroSection';
import IdentifySection from '../components/landing/IdentifySection';
import StorySection from '../components/landing/StorySection';
import SolutionsSection from '../components/landing/SolutionsSection';
import SpotifySection from '../components/landing/SpotifySection';
import YouTubeSection from '../components/landing/YouTubeSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import AlbumSection from '../components/landing/AlbumSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';

export default function HomePage() {
  usePageMeta(
    'Restauración Matrimonial en Cristo',
    'Ministerio cristiano de restauración matrimonial. Consejería pastoral con fundamento bíblico, libros y recursos para fortalecer tu matrimonio en Cristo.'
  );

  return (
    <>
      {/* Atención: esperanza en Cristo + propuesta de valor */}
      <HeroSection />
      {/* Identificación: reconocer el problema con fe */}
      <IdentifySection />
      {/* Quiénes somos: historia del ministerio */}
      <StorySection />
      {/* Solución: caminos (consejería pastoral / recursos / ambos) */}
      <SolutionsSection />
      {/* Contenido de valor: podcast y videos */}
      <SpotifySection />
      <YouTubeSection />
      {/* Prueba social: testimonios de restauración */}
      <TestimonialsSection />
      {/* Álbum de restauración: fotos de parejas */}
      <AlbumSection />
      {/* Resolver dudas + aviso responsable */}
      <FAQSection />
      {/* Acción final: Dios restaura */}
      <CTASection />
    </>
  );
}
