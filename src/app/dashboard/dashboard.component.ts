import { DashboardService } from './../_services/dashboard.service';
import { DashboardInfo } from '../_models/dashboardInfo';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardInfo;
  currentRoute: string;

  userIncreasedPercent: number = 0;
  bikeLendIncreasedPercent: number = 0;
  revenueInceasedPercent: number = 0;
  stationInceasedPercent: number = 0;

  userIncreased: number = 0;
  bikeLendIncreased: number = 0;
  revenueIncreased: number = 0;
  stationIncreased: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private router: Router) { }

  ngOnInit(): void {
    this.getDashboardInfo();
    this.currentRoute = this.router.url.substring(1);
  }

  getDashboardInfo() {
    this.dashboardService.getDashboardInfo()
      .subscribe((res: DashboardInfo) => {
        this.dashboard = res;
        this.prepareInfo(res);
      }, error => {
        console.log(error);
      })
  }

  prepareInfo(data: DashboardInfo) {
    this.userIncreased = (data.userIncreasedInThisMonth - data.userIncreasedInLastMonth);
    this.bikeLendIncreased = (data.bikeLendInThisMonth - data.bikeLendInLastMonth);
    this.revenueIncreased = (data.revenueInThisMonth - data.revenueInLastMonth);
    this.stationIncreased = (data.stationIncreasedInThisMonth - data.stationIncreasedInLastMonth);

    this.userIncreasedPercent = this.userIncreased / data.userIncreasedInLastMonth;
    this.bikeLendIncreasedPercent = this.bikeLendIncreased / data.bikeLendInLastMonth;
    this.revenueInceasedPercent = this.revenueIncreased / data.revenueInLastMonth;
    this.stationInceasedPercent = this.stationIncreased / data.stationIncreasedInLastMonth;
  }

}
