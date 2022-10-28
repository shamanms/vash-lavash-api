import { dateTimeFormatter } from '../dateTimeFormatter';

describe('utils dateTimeFormatter', () => {
  test('when date is number should return formatted date in string', () => {
    const formattedDate = '24/02/2022 05:40';
    expect(dateTimeFormatter(1645674053980)).toEqual(formattedDate);
  });
});
