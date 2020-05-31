import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'restaurants',
    pathMatch: 'full',
  },
  {
    path: 'restaurants',
    loadChildren: () =>
      import('./restaurants/restaurants.module').then(
        (m) => m.RestaurantsPageModule
      ),
  },
  {
    path: 'restaurant',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then(
        (m) => m.RestaurantPageModule
      ),
  },
  {
    path: 'restaurant/:resID',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then(
        (m) => m.RestaurantPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
