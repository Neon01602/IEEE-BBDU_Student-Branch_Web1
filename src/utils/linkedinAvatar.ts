/**
 * Utility for fetching and formatting live LinkedIn profile pictures
 */

export function getLinkedInAvatarUrl(slugOrUrl: string, name?: string): string {
  if (!slugOrUrl) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Member')}&background=090e28&color=38bdf8&size=512&bold=true`;
  }

  // If it's already an absolute non-LinkedIn URL (like ui-avatars), return it
  if (slugOrUrl.startsWith('http') && !slugOrUrl.includes('linkedin.com')) {
    return slugOrUrl;
  }

  // Extract slug from URL if full URL is given
  const slug = slugOrUrl
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')
    .replace(/\/+$/, '')
    .trim();

  // Fetch live dynamically through our backend LinkedIn avatar resolver endpoint
  return `/api/linkedin-avatar?slug=${encodeURIComponent(slug)}`;
}

export function getLinkedInProfileUrl(slugOrUrl: string): string {
  if (!slugOrUrl) return '#';
  if (slugOrUrl.startsWith('http')) return slugOrUrl;
  const slug = slugOrUrl.replace(/^\/+|\/+$/g, '').replace(/^in\//, '');
  return `https://www.linkedin.com/in/${slug}/`;
}
