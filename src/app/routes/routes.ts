import { LayoutComponent } from '../layout/layout.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { LockComponent } from './pages/lock/lock.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component'

import { AuthGuard } from '../services';

export const routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'employee', canActivate: [AuthGuard], loadChildren: './+employee/employee.module#EmployeeModule' },
            { path: 'admin', canActivate: [AuthGuard], loadChildren: './+admin/admin.module#AdminModule' },
            { path: 'systemadmin', canActivate: [AuthGuard], loadChildren: './+systemadmin/systemadmin.module#SystemadminModule' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' },
            { path: 'elements', loadChildren: './elements/elements.module#ElementsModule' },
            { path: 'forms', loadChildren: './forms/forms.module#FormsModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
            { path: 'blog', loadChildren: './blog/blog.module#BlogModule' },
            { path: 'ecommerce', loadChildren: './ecommerce/ecommerce.module#EcommerceModule' },
            { path: 'extras', loadChildren: './extras/extras.module#ExtrasModule' }
        ]
    },

     { path: 'login', loadChildren: './+auth/auth.module#AuthModule' },
    // { path: 'employee', canActivate: [AuthGuard], loadChildren: './+taskboard/employee.module#EmployeeModule' },
    { path: 'resetpassword/:id', component: ResetpasswordComponent },
    // Not lazy-loaded routes
    { path: 'login1', component: LoginComponent },
    
    { path: 'register', component: RegisterComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },

    // Not found
    { path: '**', redirectTo: 'login' }
]
