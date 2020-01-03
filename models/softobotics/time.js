'use strict';


module.exports = (sequelize, DataTypes) => {
    let Time = sequelize.define('time', {

        timeId: {
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
            type: DataTypes.STRING,
            allowNull: true,
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        }   
        
    }, {
            tableName: 'time',
            freezeTableName: true
        }
    );

    return Time;
};