import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Star, StarOff } from 'lucide-react';
import { bookService } from '../services/book.service';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({title:'',author:'',price:'',stock:'',category:'',coverImage:'',description:'',isbn:'',pages:'',publisher:''});
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();
  const fetch = async()=>{setLoading(true);try{const d=await bookService.getAllAdmin();setBooks(d.books||[]);}catch(e){error(e.message);}finally{setLoading(false);}};
  useEffect(()=>{fetch();},[]);
  const ch = (e)=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  const create = async(e)=>{e.preventDefault();if(!form.title||!form.author||!form.price){error('Título, autor y precio obligatorios');return;}setSaving(true);try{await bookService.create({...form,price:parseFloat(form.price),stock:parseInt(form.stock)||0,pages:form.pages?parseInt(form.pages):null});success('Libro creado');setForm({title:'',author:'',price:'',stock:'',category:'',coverImage:'',description:'',isbn:'',pages:'',publisher:''});fetch();}catch(e){error(e.message);}finally{setSaving(false);}};
  const del = async(id)=>{if(!confirm('¿Desactivar?'))return;try{await bookService.remove(id);success('Desactivado');fetch();}catch(e){error(e.message);}};
  const feat = async(id)=>{try{await bookService.toggleFeatured(id);fetch();}catch(e){error(e.message);}};
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-display font-bold text-gray-900">Gestión de Libros</h1><p className="text-gray-500 mt-1">Administra el catálogo de la librería.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={create} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 h-fit">
          <h4 className="font-semibold text-gray-900">Agregar libro</h4>
          <Input label="Título *" name="title" value={form.title} onChange={ch}/>
          <Input label="Autor *" name="author" value={form.author} onChange={ch}/>
          <div className="grid grid-cols-2 gap-4"><Input label="Precio *" name="price" type="number" step="0.01" value={form.price} onChange={ch}/><Input label="Stock" name="stock" type="number" value={form.stock} onChange={ch}/></div>
          <Input label="Categoría" name="category" value={form.category} onChange={ch} placeholder="Matrimonio, Fe..."/>
          <Input label="URL Portada" name="coverImage" value={form.coverImage} onChange={ch} placeholder="https://..."/>
          <Input label="Editorial" name="publisher" value={form.publisher} onChange={ch}/>
          <div className="grid grid-cols-2 gap-4"><Input label="Páginas" name="pages" type="number" value={form.pages} onChange={ch}/><Input label="ISBN" name="isbn" value={form.isbn} onChange={ch}/></div>
          <Textarea label="Descripción" name="description" value={form.description} onChange={ch} rows={3}/>
          <Button type="submit" loading={saving} className="w-full flex items-center justify-center gap-2"><Plus className="w-4 h-4"/>Agregar</Button>
        </form>
        <div className="lg:col-span-2"><h4 className="font-semibold text-gray-900 mb-4">Catálogo ({books.length})</h4>
          {loading?<Spinner/>:books.length===0?<p className="text-gray-500 text-center py-8">Sin libros.</p>:<div className="space-y-3">{books.map(b=><div key={b.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${!b.isActive?'opacity-50 border-red-200':'border-gray-200'}`}><div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">{b.coverImage?<img src={b.coverImage} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-gray-300"/></div>}</div><div className="flex-1 min-w-0"><p className="font-medium text-gray-900 text-sm truncate">{b.title}</p><p className="text-xs text-gray-500">{b.author} • ${b.price.toFixed(2)} • Stock: {b.stock}</p></div>{b.category&&<span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{b.category}</span>}<div className="flex items-center gap-2"><button onClick={()=>feat(b.id)} className={`${b.isFeatured?'text-yellow-500':'text-gray-300 hover:text-yellow-500'} transition-colors`}>{b.isFeatured?<Star className="w-4 h-4 fill-yellow-400"/>:<StarOff className="w-4 h-4"/>}</button><button onClick={()=>del(b.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></div></div>)}</div>}
        </div>
      </div>
    </div>
  );
}
