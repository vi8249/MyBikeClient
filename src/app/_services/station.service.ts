import { AccountService } from './account.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Station } from '../_models/station';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private accountService: AccountService) { }

  getStations(pageNum: number, pageSize: number, keyword: string): Observable<HttpResponse<Station[]>> {
    var targetUrl = `${this.baseUrl}BikeStations?PageNum=${pageNum}&PageSize=${pageSize}`;
    if (keyword.length != 0) targetUrl += `&filter=${keyword}`;
    return this.httpClient.get(targetUrl, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<Station[]>) => {
          res.body.forEach(s => {
            //s.createTime = new Date(s.createTime);
          });
          return res;
        }));
  }

  getStation(id: string) {
    return this.httpClient.get(`${this.baseUrl}BikeStations/${id}`).pipe(
      map((res: Station) => {
        //res.createTime = new Date(res.createTime);
        return res;
      })
    );
  }

  editStation(station: Station) {
    let headers = this.accountService.getToken();
    return this.httpClient.put(`${this.baseUrl}BikeStations/`, station, { headers });
  }

  deleteStation(id: string) {
    let headers = this.accountService.getToken();
    return this.httpClient.delete(`${this.baseUrl}BikeStations/${id}`, { headers });
  }
}
