import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, BookOpen, Package, Globe } from 'lucide-react';
import { useBook } from '../hooks/useBooks';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
export default function BookDetailPage() {
  const { slug } = useParams();
  const { book, loading } = useBook(slug);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  if(loading) return <Spinner className="py-20" size="lg"/>;
  if(!book) return <div className="text-center py-20"><p className="text-gray-500">Libro no encontrado.</p><Link to="/store" className="text-primary-600 hover:underline mt-4 inline-block">Volver</Link></div>;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-8"><ArrowLeft className="w-4 h-4"/>Volver a la tienda</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] max-w-sm mx-auto md:mx-0 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          {book.coverImage?<img src={book.coverImage} alt={book.title} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-warm-50"><BookOpen className="w-20 h-20 text-primary-200"/></div>}
        </div>
        <div>
          {book.category&&<span className="inline-block text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium mb-4">{book.category}</span>}
          <h1 className="text-3xl font-display font-bold text-gray-900">{book.title}</h1>
          <p className="text-lg text-gray-600 mt-2">por <span className="font-medium">{book.author}</span></p>
          <div className="mt-6"><span className="text-4xl font-bold text-primary-700">${book.price.toFixed(2)}</span><span className="text-sm text-gray-400 ml-2">MXN</span></div>
          <div className="mt-4">{book.stock>0?<span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full"><Package className="w-3.5 h-3.5"/>{book.stock} disponible{book.stock!==1?'s':''}</span>:<span className="text-sm text-red-700 bg-red-50 px-3 py-1 rounded-full">Agotado</span>}</div>
          <div className="mt-8">{isAuthenticated?<Button onClick={()=>addItem(book.id)} disabled={book.stock===0} className="flex items-center gap-2" size="lg"><ShoppingCart className="w-5 h-5"/>{book.stock===0?'Agotado':'Agregar al Carrito'}</Button>:<Link to="/login"><Button variant="outline" size="lg">Inicia sesión para comprar</Button></Link>}</div>
          <div className="mt-8 border-t border-gray-100 pt-6"><h3 className="font-semibold text-gray-900 mb-3">Detalles</h3><dl className="grid grid-cols-2 gap-3 text-sm">{book.publisher&&<><dt className="text-gray-500">Editorial</dt><dd>{book.publisher}</dd></>}{book.pages&&<><dt className="text-gray-500">Páginas</dt><dd>{book.pages}</dd></>}{book.isbn&&<><dt className="text-gray-500">ISBN</dt><dd className="font-mono text-xs">{book.isbn}</dd></>}{book.language&&<><dt className="text-gray-500">Idioma</dt><dd className="flex items-center gap-1"><Globe className="w-3.5 h-3.5"/>{book.language}</dd></>}</dl></div>
          {book.description&&<div className="mt-6 border-t border-gray-100 pt-6"><h3 className="font-semibold text-gray-900 mb-3">Descripción</h3><p className="text-gray-600 leading-relaxed whitespace-pre-line">{book.description}</p></div>}
        </div>
      </div>
    </div>
  );
}
