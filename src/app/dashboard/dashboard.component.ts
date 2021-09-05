import { DashboardService } from './../_services/dashboard.service';
import { Dashboard, DashboardInfo } from '../_models/dashboardInfo';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardInfo: DashboardInfo;
  currentRoute: string;

  constructor(
    public dashboardService: DashboardService,
    public accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url.substring(1);

    let u: User = null;
    this.accountService.currentUser$.subscribe((res: User) => u = res);
    //this.dashboardService.createHubConnection(u);
    //this.getDashboardInfo();
  }

  ngOnDestroy(): void {
    //this.dashboardService.stopHubConnection();
  }

  // getDashboardInfo() {
  //   this.dashboardService.getDashboardInfo()
  //     .subscribe((res: DashboardInfo) => {
  //       this.dashboardInfo = res;
  //     }, error => {
  //       console.log(error);
  //     })
  // }
}
