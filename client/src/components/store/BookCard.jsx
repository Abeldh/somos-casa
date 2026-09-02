import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { cldImage } from '../../utils/cloudinary';
export default function BookCard({ book }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const handleAdd = (e) => { e.preventDefault(); e.stopPropagation(); if(isAuthenticated) addItem(book.id); };
  return (
    <Link to={`/store/${book.slug}`} className="group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
          {book.coverImage ? <img src={cldImage(book.coverImage,{width:400})} alt={book.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-warm-50"><BookOpen className="w-12 h-12 text-primary-200"/></div>}
          {book.isFeatured && <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">Destacado</span>}
          {book.stock===0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">Agotado</span></div>}
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <p className="text-xs text-gray-500 mb-1">{book.author}</p>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">{book.title}</h3>
          {book.category && <span className="inline-block text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded mt-2 w-fit">{book.category}</span>}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <p className="text-lg font-bold text-primary-700">${book.price.toFixed(2)}</p>
            {isAuthenticated && book.stock>0 && <button onClick={handleAdd} className="w-8 h-8 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center transition-colors" title="Agregar"><ShoppingCart className="w-4 h-4"/></button>}
          </div>
        </div>
      </div>
    </Link>
  );
}
