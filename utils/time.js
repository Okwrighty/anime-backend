// utils/time.js
function secondsToReadable(secondsFromNow) {
  if (secondsFromNow <= 0) return 'Already aired';
  const days = Math.floor(secondsFromNow / 86400);
  const hours = Math.floor((secondsFromNow % 86400) / 3600);
  const mins = Math.floor((secondsFromNow % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
module.exports = { secondsToReadable };
