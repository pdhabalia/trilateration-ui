import { Routes } from '@angular/router';
import { Location } from './component/location/location';
import { History } from './component/history/history';

export const routes: Routes = [
     
   
    {
        path: '',
        component: Location
    },
    {
        path: 'location',
        component: Location
    },
    {
        path: 'history',
        component: History
    },
];
