import { Routes } from '@angular/router';
import { Location } from './component/location/location';
import { History } from './component/history/history';
import { Login } from './component/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        path: '',
        component: Login
    },
    {
        path: 'location',
        component: Location,
        canActivate: [authGuard]
    },
    {
        path: 'history',
        component: History,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login
    },
];
