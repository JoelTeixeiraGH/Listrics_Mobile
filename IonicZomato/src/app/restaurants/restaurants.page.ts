import { RestaurantsService } from './restaurants.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as R from 'ramda';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit {
  restaurantes = []; // Array dentro de array
  allRestaurantes = []; // Lista de restaurantes
  categorias: any;
  cozinhas: any;
  cityAndCategory: any;

  PORTO_ID = '311';
  LISBOA_ID = '82';
  ALGARVE_ID = '11610';

  cityID = '311'; // Porto
  cityText = 'Porto';
  categoryQ = '';
  categoryText = '';
  cuisineQ = '';
  cuisineText = '';

  pages: number[];
  paginationStart = 0;
  paginationCount = 20;
  results = 100;

  controlaLoad = 10000;
  firstTime = true;
  firstChange = 1;
  controlaChange = 0;
  disableInfinite = false;

  xdExpand = 0;

  constructor(
    private restaurantService: RestaurantsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetFiltersTwo();
    this.initCurrent();
    this.getCategories();
    this.getCuisines();
  }

  yesExpand() {
    if (this.xdExpand === 1) {
      this.xdExpand = 0;
    } else {
      this.xdExpand = 1;
    }
  }

  selectCategory(category: string) {
    this.categoryQ = category;
    this.restaurantes = [];
    this.allRestaurantes = [];
    this.paginationStart = 0;
    this.controlaLoad = 10000;
    this.firstTime = true;
    if (this.controlaChange === 2 || this.controlaChange === 1) {
      this.controlaChange -= 1;
    } else {
      this.firstChange = 0;
    }
    console.log('ca' + this.controlaChange);
    this.getRestaurantByCCC();
  }

  selectCuisine(cuisine: string) {
    this.cuisineQ = cuisine;
    this.restaurantes = [];
    this.allRestaurantes = [];
    this.paginationStart = 0;
    this.controlaLoad = 10000;
    this.firstTime = true;
    if (this.controlaChange === 2 || this.controlaChange === 1) {
      this.controlaChange -= 1;
    } else {
      this.firstChange = 0;
    }
    console.log('c' + this.controlaChange);
    this.getRestaurantByCCC();
  }

  resetFilters() {
    this.cuisineQ = '';
    this.categoryQ = '';
    this.categoryText = '';
    this.cuisineText = '';
    this.restaurantes = [];
    this.allRestaurantes = [];
    this.paginationStart = 0;
    this.controlaLoad = 10000;
    this.firstTime = true;
    this.firstChange = 1;
    this.controlaChange = 2;
    this.disableInfinite = false;
    this.getRestaurantByCCC();
  }

  resetFiltersTwo() {
    this.cuisineQ = '';
    this.categoryQ = '';
    this.categoryText = '';
    this.cuisineText = '';
    this.restaurantes = [];
    this.allRestaurantes = [];
    this.paginationStart = 0;
    this.controlaLoad = 10000;
    this.firstTime = true;
    this.firstChange = 1;
    this.controlaChange = 2;
    this.disableInfinite = false;
  }

  selectCity(city: string) {
    switch (city) {
      case 'Porto':
        this.cityID = this.PORTO_ID;
        this.cityText = city;
        break;
      case 'Lisbon':
        this.cityID = this.LISBOA_ID;
        this.cityText = city;
        break;
      case 'Algarve':
        this.cityID = this.ALGARVE_ID;
        this.cityText = city;
        break;
      default:
        break;
    }
  }

  selectCityByID(city: string) {
    switch (city) {
      case this.PORTO_ID:
        this.cityID = this.PORTO_ID;
        this.cityText = 'Porto';
        break;
      case this.LISBOA_ID:
        this.cityID = this.LISBOA_ID;
        this.cityText = 'Lisbon';
        break;
      case this.ALGARVE_ID:
        this.cityID = this.ALGARVE_ID;
        this.cityText = 'Algarve';
        break;
      default:
        break;
    }
  }

  selectCityList(city: string) {
    this.selectCity(city);
    this.restaurantes = [];
    this.allRestaurantes = [];
    this.paginationStart = 0;
    this.controlaLoad = 10000;
    this.firstTime = true;
    this.firstChange = 0;
    this.getRestaurantByCCC();
  }

  getRestaurantByCCC() {
    this.restaurantService
      .getRestaurantByCCC(
        this.cityID,
        this.categoryQ,
        this.cuisineQ,
        this.paginationStart,
        this.paginationCount
      )
      .subscribe((result) => {
        this.xdPushas(result);

        if (this.firstTime && result.results_found <= 20) {
          this.controlaLoad = 0;
          this.firstTime = false;
          this.disableInfinite = true;
        } else if (this.firstTime && result.results_found <= 40) {
          this.controlaLoad = 1;
          this.firstTime = false;
        } else if (this.firstTime && result.results_found <= 60) {
          this.controlaLoad = 2;
          this.firstTime = false;
        } else if (this.firstTime && result.results_found <= 80) {
          this.controlaLoad = 3;
          this.firstTime = false;
        } else if (this.firstTime && result.results_found > 80) {
          this.controlaLoad = 4;
          this.firstTime = false;
        }
      });
  }

  xdPushas(result) {
    this.restaurantes.push(result.restaurants);
    this.results = result.results_found;
    this.allRestaurantes = R.flatten(this.restaurantes);
  }

  getCategories() {
    this.restaurantService
      .getCategories()
      .subscribe((response) => (this.categorias = response));
  }

  getCuisines() {
    this.restaurantService
      .getCuisines(this.cityID)
      .subscribe((response) => (this.cozinhas = response));
  }

  loadData(event) {
    setTimeout(() => {
      if (this.firstChange === 1) {
        this.controlaLoad -= 1;
        if (this.controlaLoad <= 0) {
          this.disableInfinite = true;
        }
        this.paginationStart += 20;
        this.getRestaurantByCCC();
      } else {
        this.firstChange = 1;
      }
      debugger;
      event.target.complete();
    }, 3000);
  }

  initCurrent() {
    const id = this.route.snapshot.paramMap.get('city_id');
    const idCategory = this.route.snapshot.paramMap.get('categoryQ');
    const idCuisine = this.route.snapshot.paramMap.get('cuisineQ');

    this.selectCityByID(id);
    this.categoryQ = idCategory;
    this.cuisineQ = idCuisine;

    this.getRestaurantByCCC();
  }
}
