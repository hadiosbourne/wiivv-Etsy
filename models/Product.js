'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    thumbnail_url: {
      type: String
    }
  },
  {    
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection: 'Product'
  }
);

module.exports = mongoose.model('Product', ProductSchema);
