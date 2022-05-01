export const formatDuration = (duration: number): string => {
  const hours = String(Math.floor(duration / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
  const seconds = String(duration % 60).padStart(2, '0');

  if (!hours || hours === '00') {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
};
