type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: unknown) => void
) => void;

type Status = 'resolved' | 'rejected' | 'pending';

export default class QueryablePromise<T> extends Promise<T> {
  #status: Status;
  #value: T | undefined;
  #error: unknown | undefined;

  constructor(executor: Executor<T>) {
    super((resolve, reject) =>
      executor(
        (data) => {
          resolve(data);
          this.#value = data;
          this.#status = 'resolved';
        },
        (err) => {
          reject(err);
          this.#error = err;
          this.#status = 'rejected';
        }
      )
    );
    this.#status = 'pending';
  }

  get status() {
    return this.#status;
  }

  get value() {
    return this.#value;
  }

  get error() {
    return this.#error;
  }

  isResolved() {
    return this.#status === 'resolved';
  }

  isPending() {
    return this.#status === 'pending';
  }

  isRejected() {
    return this.#status === 'rejected';
  }
}
