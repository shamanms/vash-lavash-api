import { dateTimeFormatter } from '../dateTimeFormatter';

describe('utils dateTimeFormatter', () => {
  test('when date is number should return formatted date in string', () => {
    expect(dateTimeFormatter(1645674000623)).toEqual('24/02/2022 05:40');
  });
});
