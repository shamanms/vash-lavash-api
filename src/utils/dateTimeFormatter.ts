const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
};

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric'
};

export const dateTimeFormatter = (date: number) =>
  new Intl.DateTimeFormat('en-GB', {
    ...dateFormat,
    ...timeFormat,
    timeZone: 'Europe/Kiev'
  })
    .format(date)
    .replace(/,/, '');
