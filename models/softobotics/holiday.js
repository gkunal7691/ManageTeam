'use strict';

module.exports = (sequelize, DataTypes) => {
    let Holiday = sequelize.define('holiday', {

        holidayId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        holidayDate : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        holidayType : {
            type: DataTypes.ENUM('optional','mandatory'),
            allowNull: false,
        },
        occasion : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdBy : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        updatedBy : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
            tableName: 'holiday',
            freezeTableName: true
        }

    );

    return Holiday;
};