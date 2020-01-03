'use strict';


module.exports = (sequelize, DataTypes) => {
    let DayOff = sequelize.define('dayoff', {

        dayoffId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        createdBy : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedBy : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
            tableName: 'dayoff',
            freezeTableName: true
        }
    );

    return DayOff;
};