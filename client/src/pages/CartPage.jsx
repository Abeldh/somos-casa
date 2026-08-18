import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
export default function CartPage() {
  const { items, subtotal, itemCount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const ship = subtotal>=500?0:99; const total = subtotal+ship;
  if(loading) return <Spinner className="py-20" size="lg"/>;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8"><h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3"><ShoppingCart className="w-6 h-6 text-primary-600"/>Mi Carrito{itemCount>0&&<span className="text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{itemCount}</span>}</h1>{items.length>0&&<button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">Vaciar</button>}</div>
      {items.length===0?<div className="text-center py-16"><ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4"/><h3 className="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3><Link to="/store"><Button>Ver Librería</Button></Link></div>:
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">{items.map(i=><div key={i.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"><div className="w-16 h-20 sm:w-20 sm:h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">{i.book.coverImage?<img src={i.book.coverImage} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center bg-primary-50"><ShoppingBag className="w-6 h-6 text-primary-200"/></div>}</div><div className="flex-1 min-w-0"><h3 className="font-medium text-gray-900 text-sm truncate">{i.book.title}</h3><p className="text-xs text-gray-500">{i.book.author}</p><p className="text-primary-700 font-bold mt-2">${i.book.price.toFixed(2)}</p><div className="flex items-center justify-between mt-3"><div className="flex items-center gap-2"><button onClick={()=>updateQuantity(i.id,i.quantity-1)} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3"/></button><span className="text-sm font-medium w-6 text-center">{i.quantity}</span><button onClick={()=>updateQuantity(i.id,i.quantity+1)} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Plus className="w-3 h-3"/></button></div><button onClick={()=>removeItem(i.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></div></div></div>)}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-20"><h3 className="font-semibold text-gray-900 mb-4">Resumen</h3><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-500">Envío</span><span>{ship===0?<span className="text-green-600">Gratis</span>:`$${ship}`}</span></div>{ship>0&&<p className="text-xs text-gray-400">Gratis en compras +$500</p>}<div className="border-t pt-3 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-lg text-primary-700">${total.toFixed(2)}</span></div></div><Link to="/checkout" className="block mt-6"><Button className="w-full flex items-center justify-center gap-2">Pagar<ArrowRight className="w-4 h-4"/></Button></Link></div>
      </div>}
    </div>
  );
}
