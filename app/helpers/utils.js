import imageCompression from "browser-image-compression";

const beautifyName = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const compressAndConvertToBase64 = async (file) => {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

    if (!base64.startsWith("data:image/")) {
      throw new Error("Archivo no es una imagen válida");
    }

    return base64;
  } catch (err) {
    console.error("Error al comprimir o convertir la imagen:", err);
    throw err;
  }
};

const isBase64Image = (str) =>
  typeof str === "string" &&
  str.startsWith("data:image/") &&
  str.includes("base64");

const isHexColor = (str) =>
  typeof str === "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);

export { beautifyName, isBase64Image, isHexColor, compressAndConvertToBase64 };
