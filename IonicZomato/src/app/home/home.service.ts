import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const ZOMATO_API_KEY = '69c3d5c5c02ec920217ee0285d0df13e';
const BASE_URL = 'https://developers.zomato.com/api/v2.1';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private headers;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'user-key': ZOMATO_API_KEY,
    });
  }

  searchCollections(city: string) {
    const params = new HttpParams().append('city_id', `${city}`);

    return this.http.get<any>(`${BASE_URL}/collections`, {
      headers: this.headers,
      params,
    });
  }

  searchRestaurantsQuery(
    entityId: string,
    entityType: string,
    sort: string,
    order: string,
    count: number
  ) {
    const params = new HttpParams()
      .append('entity_id', `${entityId}`)
      .append('entity_type', `${entityType}`)
      .append('sort', `${sort}`)
      .append('order', `${order}`)
      .append('count', `${count}`);
    return this.http.get<any>(`${BASE_URL}/search`, {
      headers: this.headers,
      params,
    });
  }

  searchRestaurants(id: string, count: number) {
    return this.searchRestaurantsQuery(id, 'city', 'rating', 'desc', count);
  }

  searchCategories() {
    const params = new HttpParams();
    return this.http.get<any>(`${BASE_URL}/categories`, {
      headers: this.headers,
      params,
    });
  }

  searchCuisines(city: string) {
    const params = new HttpParams().append('city_id', `${city}`);
    return this.http.get<any>(`${BASE_URL}/cuisines`, {
      headers: this.headers,
      params,
    });
  }
}
