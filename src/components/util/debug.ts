import { isProd } from './env';

export const warn = (msg: string, fn: string = 'error') => {
  if (!isProd) {
    // eslint-disable-next-line no-console
    console[fn](`[Mand-Mobile]: ${msg}`);
  }
};
