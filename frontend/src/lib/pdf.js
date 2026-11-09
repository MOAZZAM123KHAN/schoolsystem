/**
 * The PDF libraries are big, so they are loaded only when someone actually
 * clicks "Download PDF". This keeps the rest of the app fast to open.
 */
async function loadPdfLibraries() {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  return { html2canvas, jsPDF };
}

/** Wait until fonts are loaded and the browser has drawn the cards. */
export async function waitForRender() {
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

/**
 * Take a picture of each report card element and put them in one PDF,
 * one A4 page per card, then download it.
 * @param {HTMLElement[]} elements  the .rc card elements
 * @param {string} filename         for example "report-card-Aarav.pdf"
 */
export async function elementsToPdf(elements, filename) {
  if (!elements.length) throw new Error("There are no report cards to download.");
  const { html2canvas, jsPDF } = await loadPdfLibraries();
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  for (let i = 0; i < elements.length; i++) {
    const canvas = await html2canvas(elements[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
  }
  pdf.save(filename);
}

/** Make a name safe to use in a file name. */
export function safeFileName(text) {
  return String(text || "student").replace(/[^\w-]+/g, "_");
}
