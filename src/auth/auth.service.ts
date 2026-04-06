import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export type User = { id: string; email: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersService.create({
      email: dto.email,
      password: hashed,
    });

    const { password: _, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string) {
    const user = this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _password, ...result } = user;

    return result;
  }

  login({ id: sub, email }: User) {
    const payload = { sub, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
