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
    redirectTo: 'home',
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
  {
    path: 'restaurant/:resID/:controlerHome',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then(
        (m) => m.RestaurantPageModule
      ),
  },
  {
    path: 'restaurants/:city_id/:categoryQ/:cuisineQ',
    loadChildren: () =>
      import('./restaurants/restaurants.module').then(
        (m) => m.RestaurantsPageModule
      ),
  },
  {
    path: 'restaurants/:city_id/:categoryQ',
    loadChildren: () =>
      import('./restaurants/restaurants.module').then(
        (m) => m.RestaurantsPageModule
      ),
  },
  {
    path: 'home/:city_id/:categoryQ',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'home/:cityText',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'restaurants/:city_id',
    loadChildren: () =>
      import('./restaurants/restaurants.module').then(
        (m) => m.RestaurantsPageModule
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
