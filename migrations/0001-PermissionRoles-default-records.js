
'use strict';

const Bluebird = require('bluebird')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const config = require('config');
const url = config.mongo['database_host'];
Bluebird.promisifyAll(MongoClient)

let PermissionRolesDefaultRecords = [
  {
    'role': 'reader',
    'accessLevels': [
      'read'
    ]
  },
  {
    'role': 'editor',
    'accessLevels': [
      'read',
      'update'
    ]
  },
  {
    'role': 'admin',
    'accessLevels': [
      'read',
      'write',
      'update',
      'delete'
    ]
  }
];

module.exports.up = next => {
  return MongoClient.connect(url)
  .then(db => {
    PermissionRolesDefaultRecords.forEach((result)=>{
      db.collection('PermissionRoles').insert(result)
    })
    MongoClient.close()
  })
  .catch(err => next(err))
}