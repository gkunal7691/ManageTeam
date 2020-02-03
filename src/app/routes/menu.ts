
const EmployeeDashboard = {
    text: 'Day View',
    link: '/employee/edashboard',
    icon: 'icon-speedometer',
    roleId: [1],
};

const Todo = {
    text: 'Todo',
    link: '/employee/todo',
    icon: 'icon-pin',
    roleId: [1]
};

const ManageLeave = {
    text: 'Manage Leave',
    link: '/employee/manage-leave',
    icon: 'fa fa-calendar-times',
    roleId: [1],
};

const TimeAttendance = {
    text: 'Month View',
    link: '/employee/month-view',
    icon: 'icon-clock',
    roleId: [1],
};

const AdminDashboard = {
    text: 'Day View',
    link: '/admin/adashboard',
    icon: 'icon-speedometer',
    roleId: [2]
};

const AdminTimeAttendance = {
    text: 'Month View',
    link: '/admin/manage-time',
    icon: 'icon-clock',
    roleId: [2],
};

const EmployeeProfile = {
    text: 'Profile',
    link: '/employee/eprofile',
    icon: 'icon-user',
    roleId: [1]
};


const EmpBacklog = {
    text: 'Backlog',
    link: '/employee/backlog',
    icon: 'icon-list',
    roleId: [1],
};

const AdminBacklog = {
    text: 'Backlog',
    link: '/admin/backlog',
    icon: 'icon-list',
    roleId: [2],
};

const OrgAdminProfile = {
    text: 'Profile',
    link: '/admin/aprofile',
    icon: 'icon-user',
    roleId: [2]
};

const AdminEmployee = {
    text: 'Employees',
    link: '/admin/admin-employee',
    icon: 'icon-user',
    roleId: [2]
};


const SuperadminDashboard = {
    text: 'Dashboard',
    link: '/systemadmin/sadashboard',
    icon: 'icon-speedometer',
    roleId: [3]
}

const SuperAdminView = {
    text: 'All Users',
    link: '/systemadmin/admin',
    icon: 'icon-user',
    roleId: [3]
}

const Notification = {
    text: 'Notification',
    link: '/systemadmin/notification',
    icon: 'icon-user',
    roleId: [3]
}

const Holiday = {
    text: 'Holiday',
    link: '/systemadmin/holiday',
    icon: 'icon-user',
    roleId: [3]
}

const Dayoff = {
    text: 'Dayoff',
    link: '/systemadmin/dayoff',
    icon: 'icon-user',
    roleId: [3]
}

const LeaveRequest = {
    text: 'Leave Requests',
    link: '/admin/leave-request',
    icon: 'icon-notebook',
    roleId: [2]
}

export const menu = [
    
    EmployeeDashboard,
    Todo,
    TimeAttendance,
    EmpBacklog,
    ManageLeave,
    AdminDashboard,
    AdminEmployee,
    AdminTimeAttendance,
    AdminBacklog,
    SuperadminDashboard,
    SuperAdminView,
    Notification,
    Holiday,
    Dayoff,
    EmployeeProfile,
    LeaveRequest,
    OrgAdminProfile
];
