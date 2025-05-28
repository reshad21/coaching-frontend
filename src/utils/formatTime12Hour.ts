export const formatTime12Hour = (time: string): string => {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minuteStr} ${ampm}`;
};
