import { DashboardService } from './dashboard.service';
import { environment } from './../../environments/environment';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { UserInfo } from '../_models/userInfo';
import { Observable } from 'rxjs';
import { PresenceService } from './presence.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,
    private presence: PresenceService,
    private dashboard: DashboardService
  ) { }

  login(model: any) {
    return this.http.post(this.baseUrl + "users/login", model).pipe(
      map((res: User) => {
        const user = res;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "users/register", model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
    this.presence.createHubConnection(user);
    this.dashboard.createHubConnection(user);
  }

  getToken(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('user')).token;

    return new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
    this.dashboard.stopHubConnection();
  }

  getHistoryRoutes(pageNum: number, pageSize: number) {
    var targetUrl = `${this.baseUrl}users/info?PageNum=${pageNum}&PageSize=${pageSize}`;
    return this.http.get(targetUrl, { headers: this.getToken(), observe: 'response' });
  }

  addValue(amount: number) {
    let headers = this.getToken();
    return this.http.post(`${this.baseUrl}users/storage/${amount}`, null, { headers });
  }

}
