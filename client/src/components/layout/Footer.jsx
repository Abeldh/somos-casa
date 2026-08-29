import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size={44} />
              <h3 className="font-display text-xl font-semibold text-white">Somos Casa</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Un ministerio que ayuda a los matrimonios a encontrar en Jesucristo la fuente de amor,
              perdón y restauración para su hogar.
            </p>
            <p className="text-xs italic text-gray-500 mt-4">
              "Si Jehová no edificare la casa, en vano trabajan los que la edifican." — Salmo 127:1
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href="mailto:somoscasatoluca@gmail.com" className="hover:text-primary-400 transition-colors break-all">somoscasatoluca@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href="https://wa.me/527224148552" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">+52 722 414 8552</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Toluca, Estado de México, MX</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary-400 transition-colors">Inicio</a></li>
              <li><a href="/about" className="hover:text-primary-400 transition-colors">Nuestra Historia</a></li>
              <li><a href="/booking" className="hover:text-primary-400 transition-colors">Agendar Consejería</a></li>
              <li><a href="/store" className="hover:text-primary-400 transition-colors">Librería</a></li>
              <li><a href="/login" className="hover:text-primary-400 transition-colors">Iniciar Sesión</a></li>
              <li><a href="/privacy" className="hover:text-primary-400 transition-colors">Aviso de Privacidad</a></li>
              <li><a href="/terms" className="hover:text-primary-400 transition-colors">Términos y Condiciones</a></li>
              <li><a href="/cookies" className="hover:text-primary-400 transition-colors">Política de Cookies</a></li>
              <li><a href="/legal" className="hover:text-primary-400 transition-colors">Aviso Legal</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Somos Casa. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Para la gloria de <Heart className="w-3 h-3 text-primary-500 fill-primary-500" /> Cristo
          </p>
        </div>
      </div>
    </footer>
  );
}
