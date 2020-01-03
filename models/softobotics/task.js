'use strict';


module.exports = (sequelize, DataTypes) => {
    let Task = sequelize.define('task', {

        taskId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(5000),
            allowNull: true,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM('normal ', 'critical', 'high', 'low'),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('planned ', 'progress', 'completed'),
            allowNull: true,
        },
        estimatedTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        originalTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        clientTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        clonned: {
            type: DataTypes.ENUM('Yes','No'),
            allowNull: true,
        }

    }, {
        tableName: 'task',
        freezeTableName: true
    }
    );



    return Task;
};