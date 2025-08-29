import { parseISO, format } from "date-fns";

export default function Date({ dateString }) {
  // Guard against missing or non-string values to avoid runtime errors
  if (typeof dateString !== "string" || !dateString) return null;
  let date;
  try {
    date = parseISO(dateString);
  } catch {
    return null;
  }
  // If parse fails silently, ensure the date is valid
  if (isNaN(date.getTime())) return null;
  return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
}
