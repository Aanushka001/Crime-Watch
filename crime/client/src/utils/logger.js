export const logError = (...args) => {
  if (import.meta.env.DEV) {
    console.error(...args);
  }
};

export const logInfo = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};
