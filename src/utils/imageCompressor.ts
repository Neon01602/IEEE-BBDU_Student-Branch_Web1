/**
 * Image compressor utility to keep document payloads safely below Firestore's 1MB limit.
 * Resizes large camera photos to max 1024px and compresses to quality JPEG/WebP.
 */

export function compressImageFile(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or tiny file, return data url directly
    if (file.type === 'image/svg+xml' || file.size < 60 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG
        let compressed = canvas.toDataURL('image/jpeg', quality);

        // If still over 200KB, compress more aggressively
        if (compressed.length > 250 * 1024) {
          compressed = canvas.toDataURL('image/jpeg', 0.55);
        }

        resolve(compressed);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Checks a data URL string and compresses it if it exceeds 150KB.
 */
export function compressDataUrlIfNeeded(dataUrl: string, maxDimension = 900): Promise<string> {
  // If it's a web URL (http:// or https://), return as-is
  if (!dataUrl.startsWith('data:image')) {
    return Promise.resolve(dataUrl);
  }

  // If already under 120KB, return as-is
  if (dataUrl.length < 120 * 1024) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.65);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
  });
}
