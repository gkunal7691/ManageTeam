import { LayoutComponent } from '../layout/layout.component';

import { AuthGuard } from '../services/guards/auth-guard.service';

export const routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'employee', canActivate: [AuthGuard], loadChildren: './+employee/employee.module#EmployeeModule' },
            { path: 'admin', canActivate: [AuthGuard], loadChildren: './+admin/admin.module#AdminModule' },
            { path: 'systemadmin', canActivate: [AuthGuard], loadChildren: './+systemadmin/systemadmin.module#SystemadminModule' },
        ]
    },

    { path: 'login', loadChildren: './+auth/auth.module#AuthModule' },

    // Not found
    { path: '**', redirectTo: 'login' }
]
