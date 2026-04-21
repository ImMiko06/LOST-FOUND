import { Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { BrowseComponent } from './components/browse/browse.component';
import { LandingComponent } from './components/landing/landing.component';
import { MyPostsComponent } from './components/my-posts/my-posts.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'posts/new', component: PostFormComponent, canActivate: [authGuard] },
  { path: 'posts/:id/edit', component: PostFormComponent, canActivate: [authGuard] },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'my-posts', component: MyPostsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
