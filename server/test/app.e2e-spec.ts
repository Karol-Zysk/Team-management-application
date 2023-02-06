import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SignUpDto } from '../src/auth/dto';
import { UpdateUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(4000);

    prisma = app.get(PrismaService);

    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:4000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: SignUpDto = {
      email: 'Karol@gmail.com',
      name: 'Karollo',
      password: '12345678',
    };
    describe('SignUp', () => {
      it('should throw error if input invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it('should throw if input not provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throw if user email taken', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(409);
      });
    });
    describe('SignIn', () => {
      it('should throw if bad input', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it('should throw no input provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: UpdateUserDto = {
          clockify_api_key: ``,
          name: 'ElonMusk',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });
  describe('Employess', () => {
    describe('Syncronize employees with clockify', () => {
      it('should throw if api key not provided', () => {
        return pactum
          .spec()
          .post('/employees/syncclockify')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(401);
      });
      it('should syncronize clockify employees if valid Api_key provided', async () => {
        const dto: UpdateUserDto = {
          clockify_api_key: `${process.env.API_KEY}`,
        };
        await pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto);

        return pactum
          .spec()
          .post('/employees/syncclockify')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(201);
      });
    });
  });
  describe('Salaries', () => {
    describe('Get Employees Salaries ', () => {
      it('should return employees salaries if clockify_api_key provided', () => {
        return pactum
          .spec()
          .get('/salary')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
      it('should throw if clockify_api_key not provided', async () => {
        const dto: UpdateUserDto = {
          clockify_api_key: ``,
        };
        await pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto);

        return pactum
          .spec()
          .post('/salaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });
    });
  });
  describe('Project Reports', () => {
    describe('Create Project Report ', () => {
      it('should return project report if clockify_api_key provided', async () => {
        const dto: UpdateUserDto = {
          clockify_api_key: `${process.env.API_KEY}`,
        };
        await pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto);
        return pactum
          .spec()
          .post('/projects/report/63bfe4b4a0346a14ee189420')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({ start: '2023-01-01' })
          .expectStatus(201);
      });
      it('should throw if clockify_api_key not provided', async () => {
        const dto: UpdateUserDto = {
          clockify_api_key: ``,
        };
        await pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto);

        return pactum
          .spec()
          .post('/salaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });
    });
  });
});
