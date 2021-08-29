import { DashboardInfo } from './../_models/dashboardInfo';
import { Observable } from 'rxjs';
import { HistoryRoute } from './../_models/userInfo';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private account: AccountService) { }

  getDashboardInfo() {
    let token = this.account.getToken();
    return this.httpClient.get<DashboardInfo>(this.baseUrl + "Dashboard/info", { headers: token });
  }
}
