import { Dashboard, DashboardInfo } from './../_models/dashboardInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { BusyService } from './busy.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private thenable: Promise<void>
  private hubConnection: HubConnection;
  private dashboardSource = new BehaviorSubject<Dashboard>(null);
  dashboard$ = this.dashboardSource.asObservable();

  constructor(private httpClient: HttpClient,
    private busyService: BusyService,
    private toastr: ToastrService) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'dashboard', {
        accessTokenFactory: () => {
          return user.token
        }
      })
      .withAutomaticReconnect()
      .build();

    this.start(user)

    if (user.admin) {
      this.hubConnection.on('GetDashboard', (dashboardInfo) => {
        const dashboard = this.prepareInfo(dashboardInfo);
        this.dashboardSource.next(dashboard);
        //this.busyService.idle()
      });

      this.hubConnection.on('UpdateDashboard', (dashboardInfo, username) => {
        this.toastr.info(username + '使用服務');
        const dashboard = this.prepareInfo(dashboardInfo);
        this.dashboardSource.next(dashboard);
      });
    }
  }

  private start(user: User) {
    this.thenable = this.hubConnection.start();
    this.thenable
      .then(() => {
        // if (user.admin)
        //   this.busyService.busy()
      })
      .catch(err => console.log('Error while establishing connection :('))
  }

  stopHubConnection() {
    if (this.hubConnection)
      this.hubConnection.stop().catch(error => console.log(error));
  }

  async updateDashboard() {
    this.thenable.then(() => {
      //this.busyService.busy();
      return this.hubConnection.invoke('UpdateDashboard')
        .catch(error => console.log(error))
        //.finally(() => this.busyService.idle());
    });
  }

  prepareInfo(data: DashboardInfo): Dashboard {
    const tUserIncreased = (data.userIncreasedInThisMonth - data.userIncreasedInLastMonth);
    const tBikeLendIncreased = (data.bikeLendInThisMonth - data.bikeLendInLastMonth);
    const tRevenueIncreased = (data.revenueInThisMonth - data.revenueInLastMonth);
    const tStationIncreased = (data.stationIncreasedInThisMonth - data.stationIncreasedInLastMonth);

    return {
      userIncreasedInLastMonth: data.userIncreasedInLastMonth,
      userIncreasedInThisMonth: data.userIncreasedInThisMonth,
      bikeLendInThisMonth: data.bikeLendInThisMonth,
      bikeLendInLastMonth: data.bikeLendInLastMonth,
      revenueInThisMonth: data.revenueInThisMonth,
      revenueInLastMonth: data.revenueInLastMonth,
      totalStationsAmount: data.totalStationsAmount,
      stationIncreasedInThisMonth: data.stationIncreasedInThisMonth,
      stationIncreasedInLastMonth: data.stationIncreasedInLastMonth,

      userIncreased: (data.userIncreasedInThisMonth - data.userIncreasedInLastMonth),
      bikeLendIncreased: (data.bikeLendInThisMonth - data.bikeLendInLastMonth),
      revenueIncreased: (data.revenueInThisMonth - data.revenueInLastMonth),
      stationIncreased: (data.stationIncreasedInThisMonth - data.stationIncreasedInLastMonth),

      userIncreasedPercent: tUserIncreased / data.userIncreasedInLastMonth,
      bikeLendIncreasedPercent: tBikeLendIncreased / data.bikeLendInLastMonth,
      revenueInceasedPercent: tRevenueIncreased / data.revenueInLastMonth,
      stationInceasedPercent: tStationIncreased / data.stationIncreasedInLastMonth,
    }
  }
}
