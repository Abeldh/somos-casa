export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function extractSpotifyId(url) {
  const match = url.match(/episode\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^?&]+)/);
  return match ? match[1] : null;
}
