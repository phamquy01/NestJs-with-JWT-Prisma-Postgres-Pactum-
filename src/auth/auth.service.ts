import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private pismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(authDto: AuthDTO) {
    const hashedPassword = await argon.hash(authDto.password);
    try {
      const user = await this.pismaService.user.create({
        data: {
          email: authDto.email,
          hashedPassword: hashedPassword,
          lastName: '',
          firstName: '',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('error');
      }
    }
  }
  async login(authDto: AuthDTO) {
    const user = await this.pismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const checkMatchedPassword = await argon.verify(
      user.hashedPassword,
      authDto.password,
    );

    if (!checkMatchedPassword) {
      throw new ForbiddenException('Iscorrect password');
    }
    delete user.hashedPassword;
    return await this.signJwtToken(user.id, user.email);
  }
  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken: jwtString,
    };
  }
}
