import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const ZOMATO_API_KEY = '69c3d5c5c02ec920217ee0285d0df13e';
const BASE_URL = 'https://developers.zomato.com/api/v2.1';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  private headers;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'user-key': ZOMATO_API_KEY,
    });
  }

  searchRestaurantsQuery(
    entityId: string,
    entityType: string,
    cuisines: string,
    category: string,
    paginationStart: number,
    paginationCount: number
  ) {
    const params = new HttpParams()
      .append('entity_id', `${entityId}`)
      .append('entity_type', `${entityType}`)
      .append('cuisines', `${cuisines}`)
      .append('category', `${category}`)
      .append('start', `${paginationStart}`)
      .append('count', `${paginationCount}`);

    return this.http.get<any>(`${BASE_URL}/search`, {
      headers: this.headers,
      params,
    });
  }

  getRestaurantByCCC(
    id: string,
    category: string,
    cuisines: string,
    paginationStart: number,
    paginationCount: number
  ) {
    return this.searchRestaurantsQuery(
      id,
      'city',
      cuisines,
      category,
      paginationStart,
      paginationCount
    );
  }

  getCategories() {
    return this.http.get(`${BASE_URL}/categories?apikey=${ZOMATO_API_KEY}`);
  }

  getCuisines(city_id: string) {
    return this.http.get(
      `${BASE_URL}/cuisines?city_id=` + city_id + `&apikey=${ZOMATO_API_KEY}`
    );
  }
}
