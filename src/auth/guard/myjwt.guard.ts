import { AuthGuard } from '@nestjs/passport';

export class MyJwtAuthGuard extends AuthGuard('jwt') {}
