import { AccountService } from './account.service';
import { Bike } from '../_models/bike';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private accountService: AccountService) { }

  getBikes(pageNum: number, pageSize: number, keyword: string) {
    var targetUrl = `${this.baseUrl}bikes?PageNum=${pageNum}&PageSize=${pageSize}`;
    if (keyword.length != 0) targetUrl += `&filter=${keyword}`;
    return this.httpClient.get(targetUrl, { observe: 'response' });
  }

  getBike(id: number) {
    return this.httpClient.get(this.baseUrl + 'bikes/' + id);
  }

  editBike(bike: Bike) {
    let headers = this.accountService.getToken();
    return this.httpClient.put(`${this.baseUrl}bikes/${bike.id}`, bike, { headers });
  }

  deleteBike(id: number) {
    let headers = this.accountService.getToken();
    return this.httpClient.delete(`${this.baseUrl}bikes/${id}`, { headers });
  }

  rentBike(id: number) {
    let headers = this.accountService.getToken();
    return this.httpClient.post(`${this.baseUrl}bikes/rent/${id}`, null, { headers });
  }

  returnBike(stationId: number, bikeId: number) {
    let headers = this.accountService.getToken();
    return this.httpClient.post(`${this.baseUrl}bikes/return/${bikeId}?stationId=${stationId}`, null, { headers });
  }

  getPrices() {
    let headers = this.accountService.getToken();
    return this.httpClient.get(`${this.baseUrl}bikes/price`, { headers });
  }
}
