"use strict";

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let config = {};

config.production = {
    db: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
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
        username: "gauranrc_tms",
        password: "tms@123456",
        database: "gauranrc_softobotics-tms",
        host: "162.215.241.152",
        dialect: "mysql",
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
        username: "pxd1x4heijsqpabb",
        password: "aiv0uks4ylkysrfl",
        database: "v3ptn4auc4zq6rv5",
        host: "s54ham9zz83czkff.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        dialect: "mysql",
        migrationStorage: "json",
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true
        }
    },
    // db: {
    //     username: "gauranrc_tms",
    //     password: "tms@123456",
    //     database: "gauranrc_softobotics-tms",
    //     host: "162.215.241.152",
    //     dialect: "mysql",
    //     migrationStorage: "json",
    //     define: {
    //         charset: 'utf8',
    //         collate: 'utf8_general_ci',
    //         timestamps: true
    //     }
    // },
    jwt: {
        secret: '1TJ!$v:BcQ^/Qy7|j9T8]+(B{~/Uyuh%fNiEPoj4{;VE{}(9~Y#31E?]u:MN;ai',
        algorithm: 'HS512'
    },
};

module.exports = config[env];