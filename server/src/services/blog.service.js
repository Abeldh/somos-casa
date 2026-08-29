import prisma from '../config/database.js';
import { cache } from '../utils/cache.js';

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const blogService = {
  // Público: lista de artículos publicados
  async getPublished({ page = 1, limit = 12 } = {}) {
    const cached = cache.get('blog:published');
    if (cached) return cached;

    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, author: true, category: true, publishedAt: true },
    });
    const result = { posts };
    cache.set('blog:published', result, 300);
    return result;
  },

  // Público: artículo por slug
  async getBySlug(slug) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) { const e = new Error('Artículo no encontrado'); e.statusCode = 404; throw e; }
    return { post };
  },

  // Admin: todos
  async getAll() {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    return { posts };
  },

  async getById(id) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) { const e = new Error('Artículo no encontrado'); e.statusCode = 404; throw e; }
    return { post };
  },

  async create({ title, excerpt, content, coverImage, author, category, isPublished }) {
    let slug = slugify(title);
    // Garantizar unicidad del slug
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        author: author || 'Somos Casa',
        category: category || null,
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    cache.invalidatePattern('blog:');
    return { post };
  },

  async update(id, data) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) { const e = new Error('Artículo no encontrado'); e.statusCode = 404; throw e; }

    const willPublish = data.isPublished !== undefined ? !!data.isPublished : existing.isPublished;
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt || null }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage || null }),
        ...(data.author !== undefined && { author: data.author || 'Somos Casa' }),
        ...(data.category !== undefined && { category: data.category || null }),
        ...(data.isPublished !== undefined && { isPublished: willPublish }),
        // Fijar publishedAt la primera vez que se publica
        ...(willPublish && !existing.publishedAt && { publishedAt: new Date() }),
      },
    });
    cache.invalidatePattern('blog:');
    return { post };
  },

  async remove(id) {
    await prisma.blogPost.delete({ where: { id } });
    cache.invalidatePattern('blog:');
    return { message: 'Artículo eliminado' };
  },
};
