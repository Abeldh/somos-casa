import { MessageCircle } from 'lucide-react';

// Configura aquí el número de WhatsApp (formato internacional, solo dígitos).
// Ejemplo México: 52 + 10 dígitos => '5215512345678'
const WHATSAPP_NUMBER = '5210000000000';
const DEFAULT_MESSAGE = 'Hola, me gustaría conocer más sobre las asesorías matrimoniales.';

export default function WhatsAppButton() {
  // Si no se ha configurado un número real, no renderizar el botón.
  if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === '5210000000000') return null;

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
