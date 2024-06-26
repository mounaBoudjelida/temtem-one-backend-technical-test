import { Request } from 'express';
import { parse } from 'path';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const { name, ext } = parse(file.originalname);
  const random = Date.now();
  callback(null, `${name}-${random}${ext}`);
};
