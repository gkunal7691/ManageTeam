
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
    text: 'Dashboard',
    link: '/admin/adashboard',
    icon: 'icon-speedometer',
    roleId: [2]
};

const AdminTimeAttendance = {
    text: 'Manage Time',
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


const Backlog = {
    text: 'Backlog',
    link: '/employee/backlog',
    icon: 'icon-list',
    roleId: [1],
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
    // headingMain,
    // Home,
    // Dashboard,
    // Widgets,
    // headingComponents,
    // Elements,
    // Forms,
    // Charts,
    // Tables,
    // Maps,
    // headingMore,
    // Pages,
    // Blog,
    // Ecommerce,
    // Extras
    EmployeeDashboard,
    Todo,
    TimeAttendance,
    Backlog,
    ManageLeave,
    AdminDashboard,
    AdminEmployee,
    AdminTimeAttendance,
    SuperadminDashboard,
    SuperAdminView,
    Notification,
    Holiday,
    Dayoff,
    EmployeeProfile,
    LeaveRequest,
    OrgAdminProfile,
    // Help,
];
