export const loadShaderFile = async (filePath) => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load shader file: ${filePath}`);
  }
  return response.text();
};

export const loadObj = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  return await response.text();
};
