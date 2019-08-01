'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PermissionRolesSchema = new Schema(
  {
    role: {
      type: String,
      required: true
    },  
    accessLevels: [{
      type: String,
      required: true
    }]
  },
  {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection: 'PermissionRoles'
  }
);

module.exports = mongoose.model('PermissionRoles', PermissionRolesSchema);
