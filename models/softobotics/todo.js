'use strict';

const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
    let Todo = sequelize.define('todo', {

        todoId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(5000),
            allowNull: true,
        },
        complete: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        star: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'todo',
        freezeTableName: true,
        timestamps: true
    }
    );



    return Todo;
};