'use strict';

module.exports = (sequelize, DataTypes) => {
    let UserInfo = sequelize.define('userInfo', {
        userInfoId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        designation: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        secondaryEmail: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        tempAddress: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        permanentAddress: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        mobile: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        bank: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        bankAccountNo: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        doj: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        pfNumber: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        department: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
    }, {
        tableName: 'userInfo',
        paranoid: true,
        timestamps: true,
        freezeTableName: true
    });

    return UserInfo;
};