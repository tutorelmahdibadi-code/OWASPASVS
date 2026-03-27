import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Solutions } from './solutions/solutions';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home, data: { title: 'OWASP ASVS Checklist' } },
    { path: 'solutions', component: Solutions },
];
