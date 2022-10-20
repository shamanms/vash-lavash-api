import { dateTimeFormatter } from '../dateTimeFormatter';

describe('utils dateTimeFormatter', () => {
  test('when date is number should return formatted date in string', () => {
    expect(dateTimeFormatter(1666265745977)).toEqual('20/10/2022 14:35');
  });
});
