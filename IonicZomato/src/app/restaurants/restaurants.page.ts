import { RestaurantsService } from './restaurants.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit {
  restaurantes = []; // Array dentro de array
  allRestaurantes = []; // Lista de comentarios
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
  currentPage = 1;
  paginationStart = 0;
  paginationCount = 20;
  results = 100;

  controlaLoad = 10000;
  firstTime = true;
  disableInfinite = false;

  xdExpand = 0;

  constructor(
    private restaurantService: RestaurantsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
    this.paginationStart = 0;
    this.getRestaurantByCCC();
  }

  selectCuisine(cuisine: string) {
    this.cuisineQ = cuisine;
    this.paginationStart = 0;
    this.getRestaurantByCCC();
  }

  resetFilters() {
    this.cuisineQ = '';
    this.categoryQ = '';
    this.categoryText = '';
    this.cuisineText = '';
    this.paginationStart = 0;
    this.getRestaurantByCCC();
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

  selectCityList(city: string) {
    this.selectCity(city);
    this.paginationStart = 0;
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
        this.restaurantes = result.restaurants;

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

  xdPushas(result) {
    this.restaurantes.push(result.restaurants);
  }

  loadData(event) {
    setTimeout(() => {
      this.controlaLoad -= 1;
      if (this.controlaLoad <= 0) {
        this.disableInfinite = true;
      }
      this.paginationStart += 20;
      this.getRestaurantByCCC();
      event.target.complete();
    }, 2000);
  }

  initCurrent() {
    const id = this.route.snapshot.paramMap.get('city_id');
    const idCategory = this.route.snapshot.paramMap.get('categoryQ');
    const idCuisine = this.route.snapshot.paramMap.get('cuisineQ');

    id && this.selectCity(id);
    this.categoryQ = idCategory;
    this.cuisineQ = idCuisine;

    this.restaurantService
      .getRestaurantByCCC(
        this.cityID,
        this.categoryQ,
        this.cuisineQ,
        this.paginationStart,
        this.paginationCount
      )
      .subscribe((result) => {
        this.restaurantes = result.restaurants;
        // pagination
      });
  }
}
