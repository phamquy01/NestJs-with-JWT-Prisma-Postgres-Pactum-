import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { spec, request } from 'pactum';

const PORT = 4000;
describe('App EndToEnd Test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.cleanDatabase();
    request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should show error with empty email', () => {
        return spec()
          .post(`/auth/register`)
          .withBody({
            email: '',
            password: '123123',
          })
          .expectStatus(400);
        // .inspect();
      });
    });

    describe('Register', () => {
      it('should show error with invalid email format', () => {
        return spec()
          .post(`/auth/register`)
          .withBody({
            email: 'email@',
            password: '123123',
          })
          .expectStatus(400);
        // .inspect();
      });
    });

    describe('Register', () => {
      it('should show error if password is empty', () => {
        return spec()
          .post(`/auth/register`)
          .withBody({
            email: 'email@gmail.com',
            password: '',
          })
          .expectStatus(400);
        // .inspect();
      });
    });

    describe('Register', () => {
      it('should register a new user', () => {
        return spec()
          .post(`/auth/register`)
          .withBody({
            email: 'email@gmail.com',
            password: '123123',
          })
          .expectStatus(201);
        // .inspect();
      });
    });
    describe('login', () => {
      it('should pass login', () => {
        return spec()
          .post(`/auth/login`)
          .withBody({
            email: 'email@gmail.com',
            password: '123123',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
        // .inspect();
      });
    });
    describe('getUser', () => {
      describe('should get detail user', () => {
        it('', () => {
          return spec()
            .post(`/user/me`)
            .withHeaders({
              Authorization: ({ data }) => `Bearer ${data.accessToken}`,
            })
            .expectStatus(200)
            .inspect();

          // .inspect();
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
  it.todo('should pass');
});
