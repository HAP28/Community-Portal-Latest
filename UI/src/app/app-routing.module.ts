import { ArticleCreateComponent } from './article/article-create/article-create.component';
import { HeaderComponent } from './header/header.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ArticlePostsComponent } from './article/article-posts/article-posts.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RolesComponent } from './admin/roles/roles.component';
import { UserComponent } from './admin/user/user.component';
import { ProductComponent } from './admin/product/product.component';
import { CategoryComponent } from './admin/category/category.component';
import { SectionComponent } from './admin/section/section.component';
import { PermissionComponent } from './admin/permission/permission.component';
import { ManageRolesComponent } from './admin/manage-roles/manage-roles.component';
import { FullarticleComponent } from './article/fullarticle/fullarticle.component';
import {ProfileComponent} from './profile/profile.component';
import { ArticleComponent } from './admin/article/article.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'header', component: HeaderComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'app', component: AppComponent },
  { path: 'user-profile', component: UserProfileComponent },
  {path:  'profile',component:ProfileComponent},
  {
    path: 'article-create',
    component: ArticleCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Publisher', 'Admin', 'Reviewer'] },
  },
  { path: 'article-posts', component: ArticlePostsComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'section',
    component: SectionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'permission',
    component: PermissionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'manageroles',
    component: ManageRolesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'managearticles',
    component: ArticleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'article',
    component: FullarticleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
