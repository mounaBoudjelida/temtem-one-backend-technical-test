import * as crypto from 'crypto';
import * as fs from 'fs';
import { logger } from './custom-logger.utils';

export const generatePassword = (length = 15) => {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => alphabet[x % alphabet.length])
    .join('');
};
export const capitalize = (str: string) =>
  str.length ? str[0].toLocaleUpperCase() + str.slice(1) : '';

export const removeFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(err);
    }
  });
};

export const removeFileFromStorage = (filePath: string) => {
  const path = `${process.cwd()}/files/${filePath}`;
  removeFile(path);
};
