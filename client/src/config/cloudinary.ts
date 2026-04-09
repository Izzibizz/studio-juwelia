const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || "";
const folder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || "juwelia";

export function isCloudinaryConfigured() {
  return Boolean(cloudName);
}

export function getCloudinaryFolder() {
  return folder;
}

export function getCloudinaryImageUrl(publicIdOrPath: string) {
  if (!cloudName || !publicIdOrPath) {
    return publicIdOrPath;
  }

  if (
    publicIdOrPath.startsWith("http://") ||
    publicIdOrPath.startsWith("https://")
  ) {
    return publicIdOrPath;
  }

  const normalizedPath = publicIdOrPath.startsWith(`${folder}/`)
    ? publicIdOrPath
    : `${folder}/${publicIdOrPath}`;

  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto/f_auto/${normalizedPath}`;
}
