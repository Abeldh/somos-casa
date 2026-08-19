/**
 * In-Memory Cache con TTL
 * Reemplaza Redis para proyectos pequeños/medianos
 * Soporta ~500-1000 usuarios simultáneos sin servicio externo
 */

class MemoryCache {
  constructor() {
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;

    // Limpieza automática cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Obtener valor del caché
   */
  get(key) {
    const item = this.store.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return item.value;
  }

  /**
   * Guardar en caché con TTL (en segundos)
   */
  set(key, value, ttlSeconds = 60) {
    this.store.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000),
    });
  }

  /**
   * Invalidar una key o pattern
   */
  del(key) {
    this.store.delete(key);
  }

  /**
   * Invalidar todas las keys que contienen un prefijo
   */
  invalidatePattern(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Limpiar entries expirados
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiry) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Stats del caché
   */
  stats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0
        ? ((this.hits / (this.hits + this.misses)) * 100).toFixed(1) + '%'
        : '0%',
    };
  }

  /**
   * Limpiar todo el caché
   */
  flush() {
    this.store.clear();
  }
}

// Singleton - una sola instancia para toda la app
export const cache = new MemoryCache();
