import { DashboardService } from './../_services/dashboard.service';
import { Dashboard, DashboardInfo } from '../_models/dashboardInfo';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() dashboard: Dashboard;
  currentRoute: string;

  constructor(
    public dashboardService: DashboardService,
    private router: Router) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url.substring(1);
  }
}
