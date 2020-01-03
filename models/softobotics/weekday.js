'use strict';

module.exports = (sequelize, DataTypes) => {
    let WeekDay = sequelize.define('weekday', {

        weekdayId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        weekday : {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
            tableName: 'weekday',
            freezeTableName: true
        }
    );

    return WeekDay;
};