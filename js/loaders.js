export const loadShaderFile = async (filePath) => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load shader file: ${filePath}`);
  }
  return response.text();
};
