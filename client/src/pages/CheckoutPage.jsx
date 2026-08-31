import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft, Copy, BookOpen } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/order.service';
import { couponService } from '../services/coupon.service';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import TermsCheckbox from '../components/ui/TermsCheckbox';
import ProofUpload from '../components/ui/ProofUpload';
import { X, Tag } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, fetchCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [orderId, setOrderId] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [f, setF] = useState({ name: user?.firstName + ' ' + user?.lastName || '', phone: '', notes: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Cupón
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [coupon, setCoupon] = useState(null); // { code, discount }

  const ch = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const discount = coupon?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) { error('Ingresa un código de cupón'); return; }
    setApplyingCoupon(true);
    try {
      const data = await couponService.validate(code, subtotal);
      setCoupon({ code: data.coupon.code, discount: data.discount });
      success(`Cupón aplicado: -$${data.discount.toFixed(2)}`);
    } catch (e) { error(e.message); setCoupon(null); }
    finally { setApplyingCoupon(false); }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name) { error('Ingresa tu nombre'); return; }
    if (!acceptedTerms) { error('Debes aceptar los Términos y Condiciones'); return; }
    setLoading(true);
    try {
      const data = await orderService.create({ ...f, couponCode: coupon?.code || undefined });
      setOrderNum(data.order.orderNumber);
      setOrderId(data.order.id);
      setOrderTotal(data.order.total);
      setDone(true);
      fetchCart();
      success('¡Pedido realizado!');
    } catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">¡Pedido registrado!</h2>
      <p className="text-gray-500 mb-4">Tu orden ha sido creada. Realiza tu transferencia y en cuanto confirmemos el pago, tus libros estarán disponibles para descarga.</p>
      <p className="text-sm bg-gray-50 rounded-lg p-3 font-mono text-gray-700 mb-6">
        Orden: <strong>{orderNum}</strong>
      </p>
      <div className="bg-warm-50 rounded-xl p-5 text-left mb-8">
        <h4 className="font-semibold text-gray-900 text-sm mb-3">Métodos de pago:</h4>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="font-medium text-gray-800 text-sm mb-2">🏦 Transferencia bancaria</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li><strong>Número de cuenta:</strong> 4027 6600 1036 6823</li>
              <li><strong>Beneficiario:</strong> Angélica Armenta Barajas</li>
              <li><strong>Concepto:</strong> {orderNum}</li>
              <li><strong>Monto:</strong> ${orderTotal > 0 ? orderTotal.toFixed(2) : '—'} MXN</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="font-medium text-gray-800 text-sm mb-2">💳 PayPal</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li><strong>Concepto:</strong> {orderNum}</li>
              <li><strong>Monto:</strong> ${orderTotal > 0 ? orderTotal.toFixed(2) : '—'} MXN</li>
            </ul>
            <a href="https://paypal.me/AArmentaBarajas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
              Pagar con PayPal
            </a>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">Envía tu comprobante por WhatsApp (722 414 8552) o al correo somoscasatoluca@gmail.com para agilizar la confirmación.</p>
      </div>

      <div className="mb-8">
        <ProofUpload
          label="Adjuntar comprobante de pago"
          value={proofUrl}
          onChange={async (url) => {
            setProofUrl(url);
            if (url && orderId) {
              try {
                await orderService.uploadProof(orderId, url);
                success('Comprobante enviado al administrador');
              } catch (e) { error(e.message); }
            }
          }}
        />
      </div>

      <div className="space-y-3">
        <Link to="/dashboard">
          <Button className="w-full">Ir a Mi Perfil</Button>
        </Link>
        <Link to="/store">
          <Button variant="ghost" className="w-full">Seguir comprando</Button>
        </Link>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
      <Link to="/store"><Button>Ir a la tienda</Button></Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-8">
        <ArrowLeft className="w-4 h-4" />Volver al carrito
      </Link>

      <h1 className="text-2xl font-display font-bold text-gray-900 mb-2 flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-primary-600" />
        Confirmar Pedido
      </h1>
      <p className="text-gray-500 mb-8">Libros digitales — recibirás acceso para descarga tras confirmar el pago.</p>

      <form onSubmit={submit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info del comprador */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Datos del comprador</h3>
            <div className="space-y-4">
              <Input label="Nombre completo *" name="name" value={f.name} onChange={ch} />
              <Input label="Teléfono / WhatsApp (para enviar comprobante)" name="phone" type="tel" value={f.phone} onChange={ch} placeholder="+52 555 123 4567" />
              <Input label="Notas (opcional)" name="notes" value={f.notes} onChange={ch} placeholder="Alguna indicación especial..." />
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>📋 Proceso:</strong> Al confirmar, se generará tu número de orden. Realiza la transferencia con ese número como concepto. Una vez verificado el depósito, recibirás un email con acceso a la descarga de tus libros.
              </p>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Tu Pedido</h3>
            <div className="space-y-3 mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {i.book.coverImage ? <img src={i.book.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-gray-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{i.book.title}</p>
                    <p className="text-xs text-gray-400">×{i.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">${(i.book.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {/* Cupón de descuento */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-700 truncate">{coupon.code}</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0" title="Quitar cupón">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label="¿Tienes un cupón?"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={applyCoupon} loading={applyingCoupon} className="mb-0.5">
                    Aplicar
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-600">Descuento ({coupon.code})</span>
                  <span className="text-green-600 font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Envío</span>
                <span className="text-green-600 font-medium">Digital — Gratis</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-700">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4">
              <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} error={!acceptedTerms && loading ? 'Requerido' : null} />
            </div>
            <Button type="submit" loading={loading} disabled={!acceptedTerms} className="w-full mt-4">
              Confirmar Pedido
            </Button>

          </div>
        </div>
      </form>
    </div>
  );
}
