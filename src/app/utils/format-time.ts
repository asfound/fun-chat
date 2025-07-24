export default function formatTime(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
