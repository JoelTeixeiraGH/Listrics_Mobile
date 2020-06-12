import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from './restaurant.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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

  controlaLoad = 0;
  firstTime = true;
  disableInfinite = false;

  controlerHome = '0';

  segment = '';

  @Input() rating: number;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter();

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
    this.controlaRouting();
  }

  searchReviews() {
    this.restaurantsoloService
      .searchReviews(this.resID, this.paginationStart, this.paginationCount)
      .subscribe((result) => {
        this.xdPushas(result);

        if (this.firstTime && result.reviews_count > 10) {
          this.firstTime = false;
          this.controlaLoad = 1;
        } else {
          this.firstTime = false;
          this.disableInfinite = true;
          this.controlaLoad = 0;
        }
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

  rate(index: number) {
    this.rating = index;
    this.ratingChange.emit(this.rating);
  }

  getColor(index: number) {
    enum COLORS {
      GREY = '#E0E0E0',
      GREEN = '#76FF03',
      YELLOW = '#FFCA28',
      RED = '#DD2C00',
    }

    if (this.isAboveRating(index)) {
      return COLORS.GREY;
    }

    switch (this.rating) {
      case 1:
      case 2:
        return COLORS.RED;
      case 3:
        return COLORS.YELLOW;
      case 4:
      case 5:
        return COLORS.GREEN;
      default:
        return COLORS.GREY;
    }
  }

  isAboveRating(index: number): boolean {
    return index > this.rating;
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

  controlaRouting() {
    const controler = this.route.snapshot.paramMap.get('controlerHome');
    this.controlerHome = controler;
  }

  loadData(event) {
    setTimeout(() => {
      this.controlaLoad -= 1;
      if (this.controlaLoad <= 0) {
        this.disableInfinite = true;
      }
      this.paginationStart += 10;
      this.searchReviews();
      event.target.complete();
    }, 1500);
  }
}
