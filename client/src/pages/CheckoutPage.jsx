import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/order.service';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
export default function CheckoutPage() {
  const { items, subtotal, fetchCart } = useCart();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [f, setF] = useState({name:'',phone:'',address:'',city:'',state:'',zip:'',notes:''});
  const ship = subtotal>=500?0:99; const total = subtotal+ship;
  const ch = (e)=>setF(p=>({...p,[e.target.name]:e.target.value}));
  const submit = async(e)=>{e.preventDefault();if(!f.name||!f.address||!f.city||!f.state){error('Completa los campos obligatorios');return;}setLoading(true);try{const d=await orderService.create(f);setOrderNum(d.order.orderNumber);setDone(true);fetchCart();success('¡Pedido realizado!');}catch(e){error(e.message);}finally{setLoading(false);}};
  if(done) return <div className="max-w-md mx-auto px-4 py-20 text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-8 h-8 text-green-600"/></div><h2 className="text-2xl font-display font-bold text-gray-900 mb-2">¡Pedido confirmado!</h2><p className="text-sm bg-gray-50 rounded-lg p-3 font-mono mb-8">Orden: <strong>{orderNum}</strong></p><Link to="/store"><Button className="w-full">Seguir comprando</Button></Link></div>;
  if(items.length===0) return <div className="text-center py-20"><p className="text-gray-500 mb-4">Carrito vacío.</p><Link to="/store"><Button>Ir a la tienda</Button></Link></div>;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-8"><ArrowLeft className="w-4 h-4"/>Volver</Link>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3"><CreditCard className="w-6 h-6 text-primary-600"/>Finalizar Compra</h1>
      <form onSubmit={submit}><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-primary-600"/>Datos de Envío</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Nombre *" name="name" value={f.name} onChange={ch}/><Input label="Teléfono" name="phone" value={f.phone} onChange={ch}/><div className="sm:col-span-2"><Input label="Dirección *" name="address" value={f.address} onChange={ch}/></div><Input label="Ciudad *" name="city" value={f.city} onChange={ch}/><Input label="Estado *" name="state" value={f.state} onChange={ch}/><Input label="C.P." name="zip" value={f.zip} onChange={ch}/></div></div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-20"><h3 className="font-semibold text-gray-900 mb-4">Pedido</h3><div className="space-y-2 mb-4 max-h-48 overflow-y-auto">{items.map(i=><div key={i.id} className="flex justify-between text-sm"><span className="text-gray-600 truncate flex-1 mr-2">{i.book.title} × {i.quantity}</span><span className="font-medium">${(i.book.price*i.quantity).toFixed(2)}</span></div>)}</div><div className="border-t pt-3 space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-500">Envío</span><span>{ship===0?<span className="text-green-600">Gratis</span>:`$${ship}`}</span></div><div className="flex justify-between border-t pt-2"><span className="font-semibold">Total</span><span className="font-bold text-lg text-primary-700">${total.toFixed(2)}</span></div></div><Button type="submit" loading={loading} className="w-full mt-6">Confirmar Pedido</Button></div>
      </div></form>
    </div>
  );
}
