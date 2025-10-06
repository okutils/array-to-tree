export class ArrayToTreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArrayToTreeError";
  }
}
