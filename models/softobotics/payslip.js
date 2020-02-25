'use strict';

module.exports = (sequelize, DataTypes) => {
    let Payslip = sequelize.define('payslip', {
        payslip_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        basic: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        house_rent_allowance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        special_allowance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        hot_skill_bonus: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        provident_fund: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        professional_tax: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        income_tax: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        month: {
            type: DataTypes.ENUM('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
            allowNull: true,
        },
        year: {
            type: DataTypes.ENUM('2019', '2020', '2021', '2022', '2023', '2024', '2025'),
            allowNull: true,
        },
        lop_days: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        std_days: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        worked_days: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'payslip',
        paranoid: true,
        timestamps: true,
        freezeTableName: true
    });

    return Payslip;
};