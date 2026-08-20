import crypto from 'crypto';

/**
 * Verifica si una contraseña ha sido comprometida en filtraciones conocidas
 * Usa la API de Have I Been Pwned con k-anonymity (no envía la contraseña completa)
 * 
 * Funcionamiento:
 * 1. Hashea la contraseña con SHA-1
 * 2. Envía solo los primeros 5 caracteres del hash a la API
 * 3. La API retorna todos los hashes que empiezan con esos 5 chars
 * 4. Buscamos localmente si el resto del hash está en la lista
 * 
 * Privacidad: La contraseña NUNCA se envía completa a ningún servidor externo.
 */

export async function isPasswordBreached(password) {
  try {
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'User-Agent': 'SomosCasa-Security-Check' },
    });

    if (!response.ok) {
      // Si la API falla, no bloquear el registro (fail-open para UX)
      console.error('[HIBP] API error:', response.status);
      return { breached: false, count: 0 };
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return { breached: true, count: parseInt(count.trim()) };
      }
    }

    return { breached: false, count: 0 };
  } catch (error) {
    // Error de red — no bloquear registro
    console.error('[HIBP] Error checking password:', error.message);
    return { breached: false, count: 0 };
  }
}
