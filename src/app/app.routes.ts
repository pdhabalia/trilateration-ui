import { Routes } from '@angular/router';
import { Location } from './component/location/location';
import { History } from './component/history/history';
import { Login } from './component/login/login';

export const routes: Routes = [
   
    {
        path: '',
        component: Login
    },
    {
        path: 'location',
        component: Location
    },
    {
        path: 'history',
        component: History
    },
    {
        path: 'login',
        component: Login
    },
];
