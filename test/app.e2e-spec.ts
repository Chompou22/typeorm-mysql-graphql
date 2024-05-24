import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { print } from 'graphql';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createUserMutation, getUsersQuery } from '../src/utils/queries';
import { AppModule } from './../src/app.module';

describe('GraphQL Server (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const dataSource = app.get(DataSource);
    await dataSource.synchronize(true);
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    if (dataSource) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
    await app.close();
  });

  /*
  because graphql itself it not actually its own protocol it serve over HTTP
  so when you set a graphql server there will be a graphql endpoint on the HTTP APIs
   */

  describe('users', () => {
    it('should query getUsers and return 0 users', () => {
      return request(app.getHttpServer()) // app instance allow you to access the HTTP
        .post('/graphql')
        .send({ query: print(getUsersQuery) })
        .expect((res) => {
          expect(res.body.data.getUsers).toHaveLength(0);
        });
    });

    it('should create a user using createUser mutation', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: print(createUserMutation),
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUser).toEqual({
            id: 1,
            username: 'anson',
            displayName: 'Anson',
          });
        });
    });

    it('should query getUsers and return 1 users', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: print(getUsersQuery) })
        .expect((res) => {
          expect(res.body.data.getUsers).toHaveLength(1);
        });
    });
  });
});
