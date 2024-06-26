import * as crypto from 'crypto';

export const generatePassword = (length = 15) => {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => alphabet[x % alphabet.length])
    .join('');
};
export const capitalize = (str: string) =>
  str.length ? str[0].toLocaleUpperCase() + str.slice(1) : '';
