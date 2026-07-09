export const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25MB
export const MAX_IMAGE_DIMENSION = 6000; // px, either side

export async function validateImageFile(file: File): Promise<string | null> {
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB)`;
  }

  const dimensions = await new Promise<{ width: number; height: number } | null>((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });

  if (dimensions && (dimensions.width > MAX_IMAGE_DIMENSION || dimensions.height > MAX_IMAGE_DIMENSION)) {
    return `Image resolution too high (max ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}px)`;
  }

  return null;
}
