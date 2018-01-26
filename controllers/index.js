'use strict';

const express = require('express');
const redis = require('redis');
const bluebird = require('bluebird');
const Any = require('../models/Any');

const router = express.Router();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({ host: process.env.REDIS_HOST });

const queryValidator = query => {
  if (!query) return { ok: true, query: {} };
  try {
    const result = JSON.parse(query);
    return { ok: true, query: result };
  } catch (error) {
    return { ok: false, error };
  }
};

const getFormattedCacheName = (offset, limit, query) =>
  `/?offset=${offset},limit=${limit},query=${query}`;

router.get('/', (req, res, next) => {
  let { offset, limit, q } = req.query;
  offset = parseInt(offset) || 0;
  limit = parseInt(limit) || 20;
  const { ok, query, error } = queryValidator(q);
  if (!ok) {
    return next(error);
  }
  return client.getAsync(getFormattedCacheName(offset, limit, query))
    .then(cachedResponse => {
      if(cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }
      Any.paginate(query, { offset, limit })
        .then((anys) => {
          client.setAsync(getFormattedCacheName(offset, limit, query), JSON.stringify(anys));
          res.json(anys);
        }).catch(next);
    });
});

router.post('/', (req, res, next) => {
  const objToSave = req.body;
  if (Object.keys(objToSave).length === 0) {
    return next(objToSave);
  }
  return Any.create(objToSave)
    .then(() => client.flushallAsync())
    .then(() => res.status(200).json())
    .catch(next);
});

module.exports = router;
