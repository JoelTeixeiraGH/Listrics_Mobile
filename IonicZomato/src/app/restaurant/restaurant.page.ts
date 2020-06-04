import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from './restaurant.service';
import { Component, OnInit } from '@angular/core';
import { Photos } from './photos';
import { PHOTOS } from './mocks';
import * as R from 'ramda';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {
  solorestaurante: any;
  solorestaurantexd: any;
  menudiario: any;
  reviews = []; // Array dentro de array
  allReviews = []; // Lista de comentarios
  resID: string;
  badRequest: boolean;
  panelOpenState = false;
  photos: Photos[];

  pages: number[];
  currentPage = 1;
  paginationStart = 0;
  paginationCount = 10;
  results = 20;

  segment = '';

  constructor(
    private restaurantsoloService: RestaurantService,
    private route: ActivatedRoute
  ) {
    this.segment = 'overview';
  }

  ngOnInit(): void {
    this.photos = PHOTOS;
    this.initCurrentSoloRestaurant();
    this.searchReviews();
    this.searchDailyMenu();
  }

  searchReviews() {
    this.restaurantsoloService
      .searchReviews(this.resID, this.paginationStart, this.paginationCount)
      .subscribe((result) => {
        this.xdPushas(result);
      });
  }

  xdPushas(result) {
    this.reviews.push(result.user_reviews);
    /*https://ramdajs.com/docs/#flatten
     Returns a new list by pulling every item out of it (and all its sub-arrays) and putting them in a new array, depth-first.*/
    this.allReviews = R.flatten(this.reviews);
  }

  searchSoloRestaurant() {
    this.restaurantsoloService
      .searchSoloRestaurant(this.resID)
      .subscribe((response) => (this.solorestaurante = response));
  }

  searchDailyMenu() {
    this.restaurantsoloService.searchDailyMenu(this.resID).subscribe(
      (response) => (this.menudiario = response),
      (error) => {
        if (error.status === 400) {
          this.badRequest = true;
        }
      }
    );
  }

  parseHours(hour) {
    this.solorestaurantexd = hour.split(',');
  }

  initCurrentSoloRestaurant() {
    const id = this.route.snapshot.paramMap.get('resID');
    if (id != null) {
      this.resID = id;
    }

    this.restaurantsoloService
      .searchSoloRestaurant(this.resID)
      .subscribe((response) => {
        this.solorestaurante = response;
        this.parseHours(response.timings);
      });
  }

  loadData(event) {
    setTimeout(() => {
      this.paginationStart += 10;
      this.searchReviews();
      event.target.complete();
    }, 500);
  }
}
