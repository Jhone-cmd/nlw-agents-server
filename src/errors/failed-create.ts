export class FailedCreate extends Error {
  constructor(resource: string) {
    super(`Failed create a new ${resource}.`);
  }
}
