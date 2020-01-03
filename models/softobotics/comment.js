'use strict';


module.exports = (sequelize, DataTypes) => {
    let Comment = sequelize.define('comment', {

        commentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        }
        
    }, {
            tableName: 'comment',
            freezeTableName: true,
            timestamps: true
        }
    );



    return Comment;
};