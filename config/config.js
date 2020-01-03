"use strict";

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let config = {};

config.production = {
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_URL,
    dialect: "mysql",
    migrationStorage: "json",
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    }
  },
  jwt: {
    secret: process.env.SECRET_KEY,
    algorithm: 'HS512'
  },
};

config.development = {
  db: {
    username: "yhq7skmvyayo0ga0",
    password: "th1oxp1vr34d0ldd",
    database: "zhp82pdx3495mq4f",
    host: "l7cup2om0gngra77.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    dialect: 'mysql',
    migrationStorage: "json",
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    }
  },
  jwt: {
    secret: '1TJ!$v:BcQ^/Qy7|j9T8]+(B{~/Uyuh%fNiEPoj4{;VE{}(9~Y#31E?]u:MN;ai',
    algorithm: 'HS512'
  },
};

config.local = {
  db: {
    username: "yhq7skmvyayo0ga0",
    password: "th1oxp1vr34d0ldd",
    database: "zhp82pdx3495mq4f",
    host: "l7cup2om0gngra77.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    dialect: 'mysql',
    migrationStorage: "json",
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    }
  },
  jwt: {
    secret: '1TJ!$v:BcQ^/Qy7|j9T8]+(B{~/Uyuh%fNiEPoj4{;VE{}(9~Y#31E?]u:MN;ai',
    algorithm: 'HS512'
  },
};

console.log("Environment --> ", env);

module.exports = config[env];
