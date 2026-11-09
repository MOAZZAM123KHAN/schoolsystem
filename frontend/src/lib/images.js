// Small helpers for photos and the school logo.

/**
 * Read an image file, resize it and return it as a data URL (text).
 * Resizing keeps the saved data small.
 *
 * @param {File} file
 * @param {object} opt
 * @param {number} opt.width      target width (or max side when height is 0)
 * @param {number} [opt.height]   target height; if set, the image is cropped to fill
 * @param {string} [opt.type]     "image/jpeg" or "image/png"
 */
export function readImage(file, { width, height = 0, type = "image/jpeg" }) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file (JPG or PNG)."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("This image could not be opened."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (height) {
          // Fixed box (student photo): fill it and crop the extra
          canvas.width = width;
          canvas.height = height;
          const scale = Math.max(width / img.width, height / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
        } else {
          // Keep proportions (logo): only shrink, never enlarge
          const k = Math.min(1, width / Math.max(img.width, img.height));
          canvas.width = Math.round(img.width * k);
          canvas.height = Math.round(img.height * k);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        resolve(canvas.toDataURL(type, 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

