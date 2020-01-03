'use strict';

const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: '1',
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'user',
        paranoid: true,
        timestamps  : true,
        freezeTableName: true
    });

    User.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    User.prototype.isValidPassword = function (password) {
        return bcrypt.compareSync(password, this.password)
    };

    User.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());

        delete values.password;
        delete values.createdBy;

        return values;
    };

    return User;
};