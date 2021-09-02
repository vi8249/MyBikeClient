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
        console.log(this.dashboard);
        this.userIncreasedPercent = (this.dashboard.userIncreasedInThisMonth - this.dashboard.userIncreasedInLastMonth) / this.dashboard.userIncreasedInLastMonth;
        this.bikeLendIncreasedPercent = (this.dashboard.bikeLendInThisMonth - this.dashboard.bikeLendInLastMonth) / this.dashboard.bikeLendInLastMonth;
        this.revenueInceasedPercent = (this.dashboard.revenueInThisMonth - this.dashboard.revenueInLastMonth) / this.dashboard.revenueInLastMonth;
        this.stationInceasedPercent = (this.dashboard.stationIncreasedInThisMonth - this.dashboard.stationIncreasedInLastMonth)
          / (this.dashboard.stationIncreasedInLastMonth == 0 ? 1 : this.dashboard.stationIncreasedInLastMonth);
      }, error => {
        console.log(error);
      })
  }

}
