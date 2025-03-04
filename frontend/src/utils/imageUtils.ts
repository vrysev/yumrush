/**
 * Formats an image URL to ensure it correctly references backend server images.
 * Handles both relative paths and already formatted URLs.
 * 
 * @param imageUrl The image URL from the product
 * @returns A fully formatted URL pointing to the image resource
 */
export const formatImageUrl = (imageUrl: string): string => {
  // If the URL is already absolute (begins with http or https), return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If the URL already starts with /images, it's already formatted correctly
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
  // If the URL is just a filename or relative path, prefix with /images
  return imageUrl.startsWith('/') ? `/images${imageUrl}` : `/images/${imageUrl}`;
};

/**
 * Gets a fallback image if the primary image is not available
 * 
 * @returns Path to default image
 */
export const getDefaultImage = (): string => {
  return '/images/default-image.png';
};