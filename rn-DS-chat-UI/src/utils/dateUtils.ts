const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
] as const;

function toDate(value: Date | number): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function isSameDay(d1: Date | number, d2: Date | number): boolean {
  const a = toDate(d1);
  const b = toDate(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date | number): boolean {
  return isSameDay(date, new Date());
}

export function isYesterday(date: Date | number): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

export function formatTime(date: Date | number, format?: string): string {
  const d = toDate(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();

  if (format === '24h') {
    return `${pad(hours)}:${pad(minutes)}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${pad(minutes)} ${period}`;
}

export function formatDayHeader(date: Date | number, format?: string): string {
  const d = toDate(date);

  if (format) {
    return formatCustomDate(d, format);
  }

  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';

  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 7) {
    return DAYS[d.getDay()];
  }

  if (d.getFullYear() === now.getFullYear()) {
    return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
  }

  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatCustomDate(date: Date, format: string): string {
  return format
    .replace('YYYY', `${date.getFullYear()}`)
    .replace('YY', `${date.getFullYear()}`.slice(-2))
    .replace('MMMM', MONTHS[date.getMonth()])
    .replace('MMM', SHORT_MONTHS[date.getMonth()])
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('D', `${date.getDate()}`);
}
