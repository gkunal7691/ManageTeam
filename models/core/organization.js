'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    let Organization = sequelize.define('Organization', {

        organizationId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pageTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'organization',
        paranoid: true,
        timestamps  : true,
        freezeTableName: true
    });
    

    
    return Organization;
};