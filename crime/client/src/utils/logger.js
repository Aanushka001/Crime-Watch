export const logError = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

export const logInfo = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};
