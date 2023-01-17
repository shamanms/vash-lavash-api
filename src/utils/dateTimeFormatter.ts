const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
};

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric'
};

const defaultTimeZone = 'Europe/Kiev';

export const dateTimeFormatter = (date: number) =>
  new Intl.DateTimeFormat('en-GB', {
    ...dateFormat,
    ...timeFormat,
    timeZone: defaultTimeZone
  })
    .format(date)
    .replace(/,/, '');

export const getDateWithTimezone = (
  timestamp: number,
  timeZone = defaultTimeZone
) => new Date(new Date(timestamp).toLocaleString('en-US', { timeZone }));
