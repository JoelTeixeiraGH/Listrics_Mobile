import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from './restaurant.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {
  solorestaurante: any;
  solorestaurantexd: any;
  menudiario: any;
  reviews: any;
  resID: string;
  badRequest: boolean;
  panelOpenState = false;

  pages: number[];
  currentPage = 1;
  paginationStart = 0;
  paginationCount = 10;
  results = 20;

  constructor(
    private restaurantsoloService: RestaurantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initCurrentSoloRestaurant();
    this.searchReviews();
    this.searchDailyMenu();
  }

  set_pages() {
    this.pages = new Array();
    const num = Math.ceil(this.results / this.paginationCount);
    for (let i = 1; i <= num; i++) {
      this.pages.push(i);
    }
  }

  pagination(page: number) {
    this.paginationStart = (page - 1) * this.paginationCount;
    this.currentPage = page;
    this.searchReviews();
  }

  searchReviews() {
    this.restaurantsoloService
      .searchReviews(this.resID, this.paginationStart, this.paginationCount)
      .subscribe((result) => {
        this.reviews = result.user_reviews;
        // pagination
        if (result.reviews_count <= 20) {
          this.results = result.reviews_count;
        }
        this.set_pages();
      });
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
}
