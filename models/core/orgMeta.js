'use strict';


module.exports = (sequelize, DataTypes) => {
    let OrgMeta = sequelize.define('orgMeta', {
        orgMetaId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        metaKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        metaValue: {
            type: DataTypes.STRING(5000),
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
    }, {
            tableName: 'orgMeta',
            paranoid: true,
            timestamps: true,
            freezeTableName: true
        });


    return OrgMeta;
};