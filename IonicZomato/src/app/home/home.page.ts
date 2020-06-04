import { HomeService } from './home.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photos } from './photos';
import { PHOTOS } from './mocks';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  collection: any;
  category: any;
  cozinhas: any;
  restaurants: any;

  PORTO_ID = '311';
  LISBOA_ID = '82';
  ALGARVE_ID = '11610';

  categoriaDrop: string;
  cidadeDrop: string;
  cozinhaDrop: string;

  photos: Photos[];

  cityID = '311'; // Porto
  countLanding = 8;

  cityText = 'Porto';

  optionCity = '';
  optionCategory = '';
  optionCuisine = '';

  sliderConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.3,
  };

  sliderConfigTwo = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.8,
  };

  sliderConfigThree = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 2.5,
  };

  constructor(
    private landingService: HomeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.photos = PHOTOS;
    this.initCurrentCollections();
    this.searchCategories();
    this.searchCuisines();
    this.searchRestaurants();
  }

  /*
  xdTestButton(xd: string, xdd: string, xddd: string) {
    this.optionCity = xd;
    this.optionCategory = xdd;
    this.optionCuisine = xddd;
    alert(this.optionCity + this.optionCategory + this.optionCuisine);
  }
  */

  searchCollections() {
    this.landingService
      .searchCollections(this.cityID)
      .subscribe((response) => (this.collection = response));
  }

  searchRestaurants() {
    this.landingService
      .searchRestaurants(this.cityID, this.countLanding)
      .subscribe((response) => (this.restaurants = response));
  }

  initCurrentCollections() {
    const id = this.route.snapshot.paramMap.get('city_id');
    if (id != null) {
      this.selectCity(id);
    }
    this.landingService
      .searchCollections(this.cityID)
      .subscribe((response) => (this.collection = response));
  }

  searchCategories() {
    this.landingService
      .searchCategories()
      .subscribe((response) => (this.category = response));
  }

  searchCuisines() {
    this.landingService
      .searchCuisines(this.cityID)
      .subscribe((response) => (this.cozinhas = response));
  }

  unselect(): void {
    this.optionCity = this.optionCategory = this.optionCuisine = '';
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

  selectCity2(city: string) {
    this.selectCity(city);
    this.searchCuisines();
    this.searchCollections();
    this.searchRestaurants();
  }

  selectCategory(category: string) {
    this.optionCategory = category;
  }

  selectCuisine(cuisine: string) {
    this.optionCuisine = cuisine;
  }

  resetAfterRouting() {
    this.optionCategory = '';
    this.optionCuisine = '';
  }
}
