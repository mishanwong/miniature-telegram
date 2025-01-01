export const loadFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load file: ${url}`);
  }
  return response.text();
};
