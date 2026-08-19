import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function CartPage() {
  const { items, subtotal, itemCount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const shippingCost = subtotal >= 500 ? 0 : 99;
  const total = subtotal + shippingCost;

  if (loading) return <Spinner className="py-20" size="lg" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary-600" />
            Mi Carrito
          </h1>
          {itemCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">{itemCount} producto{itemCount !== 1 ? 's' : ''} en tu carrito</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/store" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Link>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Vaciar
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Explora nuestra librería y encuentra recursos para fortalecer tu matrimonio.
          </p>
          <Link to="/store">
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              <ShoppingBag className="w-5 h-5" />
              Explorar Librería
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex gap-4 hover:shadow-sm transition-shadow">
                {/* Book cover */}
                <Link to={`/store/${item.book.slug}`} className="w-20 h-28 sm:w-24 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                  {item.book.coverImage ? (
                    <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-warm-50">
                      <ShoppingBag className="w-8 h-8 text-primary-200" />
                    </div>
                  )}
                </Link>

                {/* Book info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link to={`/store/${item.book.slug}`} className="hover:text-primary-600 transition-colors">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{item.book.title}</h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.book.author}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price + delete */}
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-primary-700">${(item.book.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
              <h3 className="font-semibold text-gray-900 text-lg mb-5">Resumen del Pedido</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    Envío
                  </span>
                  {shippingCost === 0 ? (
                    <span className="font-medium text-green-600">Gratis</span>
                  ) : (
                    <span className="font-medium text-gray-900">${shippingCost.toFixed(2)}</span>
                  )}
                </div>

                {shippingCost > 0 && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-700">
                      🚚 ¡Agrega ${(500 - subtotal).toFixed(2)} más para envío gratis!
                    </p>
                    <div className="mt-2 w-full bg-green-100 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-700">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-6">
                <Button className="w-full flex items-center justify-center gap-2" size="lg">
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">Pago contra entrega o transferencia</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
