'use strict';

const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
    let UserRole = sequelize.define('userRole', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
            tableName: 'userRole',
            freezeTableName: true
        });


    return UserRole;
};
