import { MessageCircle } from 'lucide-react';

// Número de WhatsApp de Somos Casa (formato internacional, solo dígitos).
const WHATSAPP_NUMBER = '527224148552';
const DEFAULT_MESSAGE = 'Hola, me gustaría conocer más sobre las asesorías matrimoniales.';

export default function WhatsAppButton() {
  if (!WHATSAPP_NUMBER) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg shadow-black/20 pl-4 pr-5 py-3 transition-all hover:scale-105 group"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline text-sm font-medium">Escríbenos</span>
    </a>
  );
}
