import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { blogService } from '../services/blog.service';
import { usePageMeta } from '../hooks/usePageMeta';
import { cldImage } from '../utils/cloudinary';
import Spinner from '../components/ui/Spinner';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    blogService.getBySlug(slug)
      .then((data) => setPost(data.post))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Datos estructurados (schema.org) del artículo para Google
  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      author: { '@type': 'Person', name: post.author },
      ...(post.publishedAt && { datePublished: post.publishedAt }),
      ...(post.excerpt && { description: post.excerpt }),
      ...(post.coverImage && { image: post.coverImage }),
      ...(post.category && { articleSection: post.category }),
      publisher: { '@type': 'Organization', name: 'Somos Casa' },
    };
  }, [post]);

  usePageMeta(post?.title, post?.excerpt || undefined, {
    path: `/blog/${slug}`,
    image: post?.coverImage,
    jsonLd,
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return <Spinner className="py-20" />;

  if (notFound || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Este artículo no está disponible.</p>
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-primary-600 font-medium mt-4">
          <ArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver al blog
      </Link>

      {post.category && (
        <span className="text-sm font-medium text-primary-600">{post.category}</span>
      )}
      <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}</span>
      </div>

      {post.coverImage && (
        <div className="rounded-2xl overflow-hidden mt-6 border border-gray-100">
          <img src={cldImage(post.coverImage,{width:1000})} alt={post.title} className="w-full object-cover" />
        </div>
      )}

      {/* Contenido: respeta saltos de línea */}
      <div className="mt-8 text-gray-700 leading-relaxed whitespace-pre-wrap text-[17px]">
        {post.content}
      </div>
    </article>
  );
}
