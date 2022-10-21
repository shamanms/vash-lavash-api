import { dateTimeFormatter } from '../dateTimeFormatter';

describe('utils dateTimeFormatter', () => {
  test('when date is number should return formatted date in string', () => {
    const reqDate = new Date(new Date().setFullYear(2022, 1, 24)).setHours(
      5,
      40
    );
    const formattedDate = '24/02/2022 05:40';
    expect(dateTimeFormatter(reqDate)).toEqual(formattedDate);
  });
});
