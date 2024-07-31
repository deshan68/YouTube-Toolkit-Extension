// src/api/googleGemini.js

export const fetchYouTubeData = async (videoId: string) => {
  console.log("4", videoId);
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
