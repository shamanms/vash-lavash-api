export class ValidationError extends Error {
  readonly code = 400;

  constructor(message: string) {
    super(message);
  }
}
