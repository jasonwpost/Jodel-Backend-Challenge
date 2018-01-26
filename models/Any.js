'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;
const transform = (doc, obj) => {
  delete obj.__v;
  delete obj._id;
  return obj;
};

const anySchema = new Schema({}, { strict: false, toJSON: { transform } });

anySchema.plugin(mongoosePaginate);
const Any = mongoose.model('any', anySchema);

module.exports = Any;