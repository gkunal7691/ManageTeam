'use strict';


module.exports = (sequelize, DataTypes) => {
    let Leave = sequelize.define('leave', {

        leaveId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        noOfdays: {
            type: DataTypes.FLOAT(5, 2),
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('comp-off','earned','optional','casual'),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('added','cancelled','rejected','approved','pending'),
            allowNull: true,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fromDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        toDate : {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
            tableName: 'leave',
            freezeTableName: true
        }
    );

    return Leave;
};