export function formatSeedTime(seedTime) {
  if (!seedTime) return null;
  if (seedTime === "NT" || seedTime === "DQ" || seedTime === "NS")
    return seedTime;
  const timeParts = seedTime.split(":");
  const secondsAndMillis = parseFloat(timeParts[2]).toFixed(2);
  if (timeParts[0] !== "00") {
    return `${timeParts[0]}:${timeParts[1]}:${secondsAndMillis}`;
  }
  if (timeParts[1] !== "00") {
    const minutes = parseInt(timeParts[1], 10);
    return `${minutes}:${secondsAndMillis}`;
  }
  return `${secondsAndMillis}`;
}
