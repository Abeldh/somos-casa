import prisma from '../config/database.js';
import { cache } from '../utils/cache.js';

function generateSlug(title) {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const bookService = {
  async getAll({ category, search, featured, page = 1, limit = 12 }) {
    // Cache para listados sin búsqueda (60 segundos)
    const cacheKey = `books:${category || 'all'}:${featured || ''}:${page}:${limit}`;
    if (!search) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    const where = { isActive: true };
    if (category) where.category = category;
    if (featured) where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      prisma.book.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.book.count({ where }),
    ]);

    const result = { books, total, pages: Math.ceil(total / limit), page };
    if (!search) cache.set(cacheKey, result, 60);
    return result;
  },

  async getBySlug(slug) {
    const cacheKey = `book:${slug}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) { const e = new Error('Libro no encontrado'); e.statusCode = 404; throw e; }

    const result = { book };
    cache.set(cacheKey, result, 120); // 2 min
    return result;
  },

  async getCategories() {
    const cached = cache.get('books:categories');
    if (cached) return cached;

    const r = await prisma.book.findMany({ where: { isActive: true, category: { not: null } }, select: { category: true }, distinct: ['category'] });
    const result = { categories: r.map(b => b.category).filter(Boolean) };
    cache.set('books:categories', result, 300); // 5 min
    return result;
  },

  async getFeatured() {
    const cached = cache.get('books:featured');
    if (cached) return cached;

    const books = await prisma.book.findMany({ where: { isActive: true, isFeatured: true }, take: 8, orderBy: { createdAt: 'desc' } });
    const result = { books };
    cache.set('books:featured', result, 120);
    return result;
  },

  async getAllAdmin() {
    const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
    return { books };
  },

  async create(data) {
    let slug = generateSlug(data.title);
    const ex = await prisma.book.findUnique({ where: { slug } });
    if (ex) slug = `${slug}-${Date.now().toString(36)}`;
    const book = await prisma.book.create({ data: { ...data, slug } });
    cache.invalidatePattern('books:');
    return { book };
  },

  async update(id, data) {
    if (data.title) {
      let slug = generateSlug(data.title);
      const ex = await prisma.book.findFirst({ where: { slug, id: { not: id } } });
      if (ex) slug = `${slug}-${Date.now().toString(36)}`;
      data.slug = slug;
    }
    const book = await prisma.book.update({ where: { id }, data });
    cache.invalidatePattern('books:');
    cache.invalidatePattern('book:');
    return { book };
  },

  async remove(id) {
    await prisma.book.update({ where: { id }, data: { isActive: false } });
    cache.invalidatePattern('books:');
    return { message: 'Libro desactivado' };
  },

  async toggleActive(id) {
    const b = await prisma.book.findUnique({ where: { id } });
    if (!b) { const e = new Error('No encontrado'); e.statusCode = 404; throw e; }
    const u = await prisma.book.update({ where: { id }, data: { isActive: !b.isActive } });
    cache.invalidatePattern('books:');
    return { book: u };
  },

  async toggleFeatured(id) {
    const b = await prisma.book.findUnique({ where: { id } });
    if (!b) { const e = new Error('No encontrado'); e.statusCode = 404; throw e; }
    const u = await prisma.book.update({ where: { id }, data: { isFeatured: !b.isFeatured } });
    cache.invalidatePattern('books:');
    return { book: u };
  },
};
