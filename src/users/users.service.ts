import { Injectable } from '@nestjs/common';
import { User } from './users.interface';

@Injectable()
export class UsersService {
  // TEMPORARY in-memory users.
  private readonly users: User[] = [];

  create(data: { email: string; password: string }): User {
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  updateRefreshToken(id: string, token: string | null): void {
    const user = this.findById(id);

    if(user) user.refreshToken = token ?? undefined;
  }
}
