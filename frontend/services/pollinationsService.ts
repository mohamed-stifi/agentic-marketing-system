export const POLLINATIONS_API_URL = "https://image.pollinations.ai";

export const generateImage = async (description: string): Promise<string> => {
  try {
    // Backend now provides detailed prompts, so we use the description directly
    const prompt = encodeURIComponent(description);
    const imageUrl = `${POLLINATIONS_API_URL}/${prompt}`;

    // Fetch image as a blob
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }
    const blob = await response.blob();
    const localUrl = URL.createObjectURL(blob);

    return localUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
};
