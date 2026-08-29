import { Link } from 'react-router-dom';
import { Cross, Heart, BookOpen, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const values = [
  {
    icon: Cross,
    title: 'Cristo en el centro',
    text: 'Todo lo que hacemos parte de Jesucristo y su Palabra. Él es el fundamento sobre el cual se edifica un matrimonio firme.',
  },
  {
    icon: Heart,
    title: 'Restauración y esperanza',
    text: 'Creemos que Dios restaura lo que parece perdido. Ningún matrimonio está fuera del alcance de su gracia.',
  },
  {
    icon: BookOpen,
    title: 'Fundamento bíblico',
    text: 'Nuestra consejería y recursos se apoyan en principios de la Palabra de Dios, no en modas ni opiniones pasajeras.',
  },
  {
    icon: Users,
    title: 'Acompañamiento en fe',
    text: 'Caminamos contigo con oración, cercanía y amor, como una familia en la fe que te sostiene.',
  },
];

export default function AboutPage() {
  usePageMeta(
    'Nuestra Historia',
    'Conoce la historia de Somos Casa y sus pastores. Un ministerio dedicado a la restauración de los matrimonios en Jesucristo.'
  );
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-warm-50 via-white to-primary-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Cross className="w-4 h-4" />
            Nuestra Historia
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
            Somos Casa
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Un ministerio dedicado a que los matrimonios encuentren en Jesucristo la fuente de amor,
            perdón y restauración para su hogar.
          </p>
          <p className="mt-6 text-sm text-gray-500 italic">
            "Y esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye." — 1 Juan 5:14
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6">
              ¿Cómo comenzó Somos Casa?
            </h2>
            {/* TODO: Reemplazar TODO este bloque con la historia real de Somos Casa. */}
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Somos Casa nació del llamado de Dios para servir a las parejas y las familias. En medio
                de un mundo que muchas veces desanima al matrimonio, creemos firmemente que Jesucristo
                sigue transformando vidas y restaurando hogares.
              </p>
              <p>
                A lo largo de este caminar hemos visto cómo la oración, la Palabra de Dios y el
                acompañamiento pastoral traen sanidad a corazones heridos y renuevan el amor entre
                esposos. Cada testimonio de restauración nos recuerda que para Dios no hay imposibles.
              </p>
              <p>
                Hoy, Somos Casa es un espacio donde los matrimonios pueden recibir consejería con
                fundamento bíblico, recursos que edifican y una comunidad de fe que camina a su lado.
                Todo con un solo propósito: glorificar a Cristo a través de familias restauradas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pastores */}
      <section className="py-16 md:py-20 bg-warm-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Nuestros Pastores</h2>
            <p className="text-gray-500 mt-2">Siervos de Dios con un corazón por los matrimonios.</p>
          </div>

          {/* TODO: Reemplazar con la información real de los pastores (nombres, foto, historia). */}
          <div className="bg-white rounded-2xl border border-primary-100 p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden border border-primary-100 shadow-md">
                <img
                  src="/images/pastores.jpg"
                  alt="Pastores de Somos Casa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xl font-display font-bold text-gray-900">
                  Pastores de Somos Casa
                </h3>
                <p className="text-sm text-primary-600 font-medium mt-1">Fundadores del ministerio</p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Con años de servicio en la obra de Dios y un profundo amor por las familias, nuestros
                  pastores dedican su vida a acompañar a los matrimonios en su camino de fe. Su testimonio
                  y su entrega reflejan el corazón de Cristo por cada hogar.
                </p>
                <p className="text-gray-500 text-sm mt-4 italic">
                  (Reemplazar este texto con los nombres, la historia y el testimonio real de los pastores.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              En qué creemos
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Nuestros Pilares</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="flex items-start gap-4 bg-warm-50 rounded-xl p-6">
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{v.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
            Permítenos caminar contigo
          </h2>
          <p className="mt-3 text-primary-100">
            Dios tiene un propósito hermoso para tu matrimonio. Da el primer paso hoy.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking">
              <span className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-medium py-4 px-8 text-lg rounded-lg transition-colors">
                <Calendar className="w-5 h-5" />
                Agendar consejería
              </span>
            </Link>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-medium py-4 px-8 text-lg rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Ver libros
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
