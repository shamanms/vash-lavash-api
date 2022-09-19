import { validateProductsPut } from '../validation';

const sendMessage = jest.fn();
const res = {
  status: jest.fn().mockImplementation(() => ({
    send: sendMessage
  }))
};
describe('validateProductsPut', () => {
  test('when products !== [] should return invalid request', () => {
    const req = {};
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid request');
  });
});
