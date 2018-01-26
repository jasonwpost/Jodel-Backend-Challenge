'use strict';

const supertest = require('supertest');

const request = supertest('http://localhost:3000');

const generateRandomInt = () =>
  Math.floor((Math.random()*100) + 1);

describe('code challenge api', () => {
  describe('create request', () => {
    it('should respond OK with a valid input', () =>
      request
        .post('/')
        .send({ test: 'good test' })
        .expect(200)
        .expect(({ body }) => expect(body).toBeFalsy())
    );

    it('should respond not OK without a JSON object', () =>
      request
        .post('/')
        .expect(500)
    );

    it('should respond not OK when not using JSON', () =>
      request
        .post('/')
        .set('Content-Type', 'text/plain')
        .send('test')
        .expect(500)
    );
  });

  describe('list request', () => {
    it('should get a paginated list of docs', () =>
      request
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('offset');
          expect(body).toHaveProperty('limit');
          expect(body).toHaveProperty('total');
          expect(body).toHaveProperty('docs');
        })
    );

    it('total should increase by one after a create request', () => {
      let count;
      return request
        .get('/')
        .then(({ body: { total } }) => { count = total })
        .then(() =>
          request
            .post('/')
            .send({ test: 'a single request' }))
        .then(() =>
          request
            .get('/')
            .expect(({ body: { total } }) => expect(total).toEqual(count + 1))
        );
    });

    it('should query with a correct query parameter', () => {
      const postData = { test: 'aUniqueValue'};
      return request
        .post('/')
        .send(postData)
        .then(() => {
          request
            .get('/')
            .query({ q: JSON.stringify(postData) })
            .expect(({body: { docs } }) => {
              expect(docs[0]).toBe(postData);
            });
        });
    });

    it('should fail with malformed query data', () => {
      const malformedData = "{ test : 'fail'";
      return request
        .get('/')
        .query({ q: malformedData })
        .expect(500);
    });

    it('should accept valid offset and limit values', () => {
      const randomOffset = generateRandomInt();
      const randomLimit = generateRandomInt();
      return request
        .get('/')
        .query({ offset: randomOffset, limit: randomLimit })
        .expect(200)
        .expect(({ body: { offset, limit }}) => {
          expect(offset).toEqual(randomOffset);
          expect(limit).toEqual(randomLimit);
        });
    });

    it('should ignore invalid offset and limit values', () =>
      request
        .get('/')
        .query({ offset: 'offset', limit: 'limit' })
        .expect(200)
        .expect(({ body: { offset, limit } }) => {
          expect(typeof offset).toBe('number');
          expect(typeof limit).toBe('number');
        })
    );
  });
});
