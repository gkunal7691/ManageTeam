'use strict';

const Sequelize = require('sequelize');
let config = require(__dirname + '/../config/db-config');

let db = {};
let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL);
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* MODELS */

/* CORE */
db.User = require('./core/user')(sequelize, Sequelize);
db.Organization = require('./core/organization')(sequelize, Sequelize);
db.UserRole = require('./core/userRole')(sequelize, Sequelize);
db.UserMeta = require('./core/userMeta')(sequelize, Sequelize);
db.OrgMeta = require('./core/orgMeta')(sequelize, Sequelize);

/* softobotics */
db.Task = require('./softobotics/task')(sequelize, Sequelize);
db.Comment = require('./softobotics/comment')(sequelize, Sequelize);
db.Leave = require('./softobotics/leave')(sequelize, Sequelize);
db.DayOff = require('./softobotics/dayoff')(sequelize, Sequelize);
db.Holiday = require('./softobotics/holiday')(sequelize, Sequelize);
db.Todo = require('./softobotics/todo')(sequelize, Sequelize);
db.WeekDay = require('./softobotics/weekday')(sequelize, Sequelize);
db.UserInfo = require('./softobotics/userInfo')(sequelize, Sequelize);
db.Payslip = require('./softobotics/payslip')(sequelize, Sequelize);

/* MAPPING */

/* CORE */
db.Organization.hasMany(db.User, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.UserRole.hasMany(db.User, { foreignKey: 'roleId', sourceKey: 'id' });
db.Organization.hasMany(db.OrgMeta, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.User.hasMany(db.OrgMeta, { foreignKey: 'userId', sourceKey: 'id' });


/* softobotics */
db.Organization.hasMany(db.DayOff, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.Organization.hasMany(db.Holiday, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.Organization.hasMany(db.Task, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.Organization.hasMany(db.Leave, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.Organization.hasMany(db.Payslip, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.Task.hasMany(db.Comment, { foreignKey: 'taskId', sourceKey: 'taskId' });
db.User.belongsToMany(db.Task, { through: 'task_user', foreignKey: 'userId' });
db.Task.belongsToMany(db.User, { through: 'task_user', foreignKey: 'taskId' });
db.Task.belongsTo(db.User, { as: 'createdBy', constraints: false });
db.Task.belongsTo(db.User, { as: 'updatedBy', constraints: false });
db.Task.belongsTo(db.User, { as: 'user', constraints: false });
db.Comment.belongsTo(db.User, { as: 'createdBy', constraints: false });
db.User.hasMany(db.Leave, { foreignKey: 'userId', sourceKey: 'id' });
db.Leave.belongsTo(db.User, { foreignKey: 'userId', sourceKey: 'id' });
db.Organization.hasMany(db.Todo, { foreignKey: 'organizationId', sourceKey: 'organizationId' });
db.User.hasMany(db.Todo, { foreignKey: 'userId', sourceKey: 'id' });
db.User.hasMany(db.Task, { foreignKey: 'userId', sourceKey: 'id' });
db.WeekDay.hasMany(db.DayOff, { foreignKey: 'weekdayId', sourceKey: 'weekdayId' });
// db.User.hasOne(db.UserInfo, { foreignKey: 'userId', sourceKey: 'id' });
db.UserInfo.belongsTo(db.User, { foreignKey: 'userId', sourceKey: 'id' });
db.User.hasMany(db.Payslip, { foreignKey: 'userId', sourceKey: 'id' });
db.Payslip.belongsTo(db.User, { as: 'user', constraints: false });

module.exports = db;
