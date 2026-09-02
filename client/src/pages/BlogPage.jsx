import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { blogService } from '../services/blog.service';
import { usePageMeta } from '../hooks/usePageMeta';
import { cldImage } from '../utils/cloudinary';
import Spinner from '../components/ui/Spinner';

export default function BlogPage() {
  usePageMeta(
    'Blog',
    'Artículos cristianos sobre matrimonio, comunicación, perdón y vida en familia bajo el señorío de Cristo.'
  );

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getPublished()
      .then((data) => setPosts(data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-warm-50 via-white to-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">Reflexiones para tu matrimonio</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Artículos con fundamento bíblico para fortalecer tu relación y crecer en la fe como familia.
          </p>
        </div>
      </section>

      {/* Lista */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Spinner className="py-12" />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">Pronto compartiremos artículos para tu edificación.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] bg-warm-100 overflow-hidden">
                    {post.coverImage ? (
                      <img src={cldImage(post.coverImage,{width:500})} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {post.category && (
                      <span className="text-xs font-medium text-primary-600 mb-1">{post.category}</span>
                    )}
                    <h2 className="font-display font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-3 flex-1">{post.excerpt}</p>}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}
                      </span>
                      <span className="text-xs text-primary-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Leer <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
