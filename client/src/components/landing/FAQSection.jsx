import { useState } from 'react';
import { ChevronDown, HelpCircle, Info } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const faqs = [
  {
    q: '¿Cómo funciona una asesoría?',
    a: 'Reservas una sesión desde tu panel, recibes la confirmación con el enlace de videollamada, tienes tu sesión y al final se establecen objetivos y próximos pasos para tu relación.',
  },
  {
    q: '¿Las asesorías son en línea?',
    a: 'Sí. Las sesiones se realizan por videollamada, para que puedas participar desde donde te sientas más cómodo.',
  },
  {
    q: '¿La asesoría es individual o para parejas?',
    a: 'Puede ser de ambas formas. Al agendar puedes indicarnos tu situación para adaptar el enfoque de la sesión.',
  },
  {
    q: '¿Qué situaciones se pueden trabajar?',
    a: 'Comunicación, conflictos frecuentes, confianza, distancia emocional, convivencia, acuerdos de pareja y el fortalecimiento general de la relación, entre otras.',
  },
  {
    q: '¿Cómo compro un libro?',
    a: 'Explora la librería, agrega los libros a tu carrito y completa el proceso de compra. Los libros son digitales, así que podrás descargarlos desde tu panel una vez confirmado tu pago.',
  },
  {
    q: '¿Qué pasa después de realizar el pago?',
    a: 'Recibirás la confirmación y, en el caso de los libros, la descarga se habilita en la sección "Mis Libros" de tu panel una vez verificado el pago.',
  },
  {
    q: '¿Puedo combinar libro y asesoría?',
    a: 'Claro. Muchas personas prefieren aprender con los libros y complementarlo con el acompañamiento de una asesoría. Puedes hacer ambos a tu propio ritmo.',
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
            <strong className="text-gray-800">Aviso importante:</strong> nuestras asesorías son un espacio de
            orientación y acompañamiento para tu relación. No sustituyen la atención psicológica, terapéutica
            o médica profesional cuando esta sea necesaria. Si tú o tu pareja atraviesan una crisis que requiere
            atención especializada, te recomendamos acudir a un profesional de la salud mental.
          </p>
        </div>
      </div>
    </section>
  );
}
