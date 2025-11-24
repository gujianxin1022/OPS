/**
 * 防止重复请求
 * @param {*} promiseFn
 * @returns
 */
export const antiDuplicationRequest = (promiseFn) => {
  let promiseInstance = null;
  return function (...args) {
    return promiseInstance
      ? promiseInstance
      : (promiseInstance = promiseFn
          .apply(this, args)
          .finally(() => (promiseInstance = null)));
  };
};
