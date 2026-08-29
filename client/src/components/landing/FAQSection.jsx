import { useState } from 'react';
import { ChevronDown, HelpCircle, Info } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const faqs = [
  {
    q: '¿Qué es la consejería pastoral de Somos Casa?',
    a: 'Es un espacio de acompañamiento con fundamento en la Palabra de Dios, donde oramos contigo y te guiamos con principios bíblicos para fortalecer y restaurar tu matrimonio.',
  },
  {
    q: '¿Cómo funciona una sesión?',
    a: 'Reservas tu sesión desde tu panel, recibes la confirmación con el enlace de videollamada, tienes tu sesión y al final establecemos juntos los próximos pasos, siempre poniendo tu hogar en las manos de Dios.',
  },
  {
    q: '¿Las sesiones son en línea?',
    a: 'Sí. Las sesiones se realizan por videollamada, para que puedas participar desde donde te sientas más cómodo, en cualquier lugar.',
  },
  {
    q: '¿Es necesario ser cristiano para recibir consejería?',
    a: 'Recibimos con amor a toda pareja que desee ayuda para su matrimonio. Nuestro enfoque es cristocéntrico y bíblico, y compartimos con respeto la esperanza que hemos encontrado en Jesucristo.',
  },
  {
    q: '¿Qué situaciones podemos llevar delante de Dios?',
    a: 'Comunicación, conflictos, confianza, distancia emocional, perdón, convivencia y el fortalecimiento general del matrimonio. Creemos que en Cristo hay restauración para cada área del hogar.',
  },
  {
    q: '¿Cómo adquiero un libro?',
    a: 'Explora la librería, agrega los libros a tu carrito y completa la compra. Los libros son digitales, así que podrás descargarlos desde tu panel una vez confirmado tu pago.',
  },
  {
    q: '¿Puedo combinar libros y consejería?',
    a: 'Claro. Muchas parejas complementan la lectura de los recursos con el acompañamiento pastoral. Puedes caminar a tu propio ritmo, de la mano de Dios.',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-gray-900">{faq.q}</span>
        <ChevronDown
          className={classNames(
            'w-5 h-5 text-primary-600 flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <p className="text-gray-600 text-sm leading-relaxed pb-5 pr-8 animate-fade-in">{faq.a}</p>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-warm-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Preguntas Frecuentes
          </div>
          <h2 className="section-title">Resolvemos tus dudas</h2>
          <p className="section-subtitle mx-auto">
            Todo lo que necesitas saber antes de dar el primer paso.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 px-6 sm:px-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        {/* Aviso responsable */}
        <div className="mt-8 flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-5">
          <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-800">Aviso importante:</strong> nuestra consejería es un espacio de
            orientación y acompañamiento pastoral con fundamento bíblico. No sustituye la atención psicológica,
            terapéutica o médica profesional cuando esta sea necesaria. Si tú o tu pareja atraviesan una crisis
            que requiere atención especializada, con amor te animamos a buscar también el apoyo de un profesional
            de la salud, confiando en que Dios usa distintos medios para traer sanidad.
          </p>
        </div>
      </div>
    </section>
  );
}
