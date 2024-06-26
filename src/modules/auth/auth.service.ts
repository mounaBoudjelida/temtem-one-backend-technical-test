import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email, true);
    /*const isPasswordValid = await this.usersService.validatePassword(
      user.password,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }*/
    const payload = { sub: user._id, email: loginDto.email };
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
