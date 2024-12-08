export function formatTime(timeStr) {
  if (!timeStr) return null;
  if (timeStr === "NT" || timeStr === "DQ" || timeStr === "NS") return timeStr;

  const parts = timeStr.split(":");
  let formattedTime = [];

  if (parts.length === 3) {
    // HH:MM:SS.ms
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const [seconds, ms = "00"] = parts[2].split(".");

    if (hours > 0) formattedTime.push(String(hours).padStart(2, "0"));
    formattedTime.push(String(minutes).padStart(2, "0"));
    formattedTime.push(
      `${String(seconds).padStart(2, "0")}.${ms.padEnd(2, "0").slice(0, 2)}`
    );
  } else if (parts.length === 2) {
    // MM:SS.ms
    const minutes = parseInt(parts[0], 10);
    const [seconds, ms = "00"] = parts[1].split(".");

    if (minutes > 0) formattedTime.push(String(minutes).padStart(2, "0"));
    formattedTime.push(
      `${String(seconds).padStart(2, "0")}.${ms.padEnd(2, "0").slice(0, 2)}`
    );
  } else {
    throw new Error("Invalid time format");
  }

  return formattedTime.join(":");
}
