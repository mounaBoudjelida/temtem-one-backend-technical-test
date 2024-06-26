import mongoose from 'mongoose';
import { Role } from 'src/enums/role.enum';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

const _ADMIN_SEED: CreateUserDto = {
  firstname: 'admin',
  lastname: 'admin',
  email: '',
  password: ''
  
};

export const ADMIN_SEED = (email: string, role: string) => ({
  ..._ADMIN_SEED,
  email,
  role,
});
