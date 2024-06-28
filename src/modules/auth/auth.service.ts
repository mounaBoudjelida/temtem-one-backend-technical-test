import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { ITokenPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: User): Promise<{ access_token: string }> {
    const payload: ITokenPayload = {
      email: user.email,
      sub: user._id.toString(),
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email, true);
    const isPasswordValid = await this.usersService.validatePassword(
      user.password,
      password,
    );
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}
