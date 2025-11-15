// Helper function to parse duration string to minutes
export function parseDurationToMinutes(duration: string): number {
  const cleaned = duration.toLowerCase().trim()

  // Match patterns like: 30m, 1hr, 1.5h, 90 minutes, etc.
  const hourMatch = cleaned.match(/^(\d+\.?\d*)\s*h(?:r|ours?)?$/i)
  const minuteMatch = cleaned.match(/^(\d+)\s*m(?:in|inutes?)?$/i)

  if (hourMatch) {
    return Math.round(parseFloat(hourMatch[1]) * 60)
  } else if (minuteMatch) {
    return parseInt(minuteMatch[1])
  }

  // Default: try to parse as number (assume minutes)
  const num = parseInt(cleaned)
  return isNaN(num) ? 60 : num
}

// Helper function to format minutes to readable duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  } else if (minutes % 60 === 0) {
    return `${minutes / 60} hr`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }
}
