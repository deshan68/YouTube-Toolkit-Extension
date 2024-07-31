export const valueText = (value: number): string => {
  return `${value} sec`;
};

export const cleanText = (text: string): string => {
  return text
    .replace(/\r/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const timeToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(":");
  const [secs, ms] = seconds.split(",");

  return (
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(secs) +
    parseInt(ms) / 1000
  );
};

export const truncateTitle = (title: string, maxTitleLength: number) => {
  if (title.length <= maxTitleLength) {
    return title;
  }
  return `${title.substring(0, maxTitleLength)}...`;
};
