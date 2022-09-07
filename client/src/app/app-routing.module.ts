import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: async () => (await import('./auth/auth.module')).AuthModule,
    },
    {
        path: '',
        loadChildren: async () => (await import('./posts/posts.module')).PostsModule,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard],
})
export class AppRoutingModule {}
