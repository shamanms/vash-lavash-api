import { dateTimeFormatter } from '../dateTimeFormatter';

describe('utils dateTimeFormatter', () => {
  test('when date is number should return formatted date in string', () => {
    // const date = '24/02/2022';
    // const time = '04:05';
    // expect(
    //   dateTimeFormatter(
    //     new Date(`${date.split('/').reverse().join('/')} ${time}`).getTime()
    //   )
    // ).toEqual(`${date} ${time}`);
    expect(dateTimeFormatter(1645674053980)).toEqual('24/02/2022 05:40');
  });
});
