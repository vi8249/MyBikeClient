import { Router } from '@angular/router';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../_services/dashboard.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  title = 'MyBike';
  model: any = {};

  constructor(
    public accountService: AccountService,
    private dashboard: DashboardService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model)
      .subscribe((res: any) => {
        // console.log(res);
        const admin = JSON.parse(localStorage.getItem('user'))?.admin;
        if (admin) this.router.navigate(['/bikes']);
      }, error => {
        console.log(error);
        this.toastr.error(error.error);
      });
  }

  logout() {
    this.accountService.logout();
  }

  register() {
    this.accountService.register(this.model)
      .subscribe((res: User) => {
        this.dashboard.updateDashboard()
          .catch(error => console.log(error));
      }, error => {
        let errors = error.error.errors;
        if (errors.Email)
          this.toastr.error(errors.Email);
        if (errors.Password)
          this.toastr.error(errors.Password);
        if (errors.ConfirmPassword)
          this.toastr.error(errors.ConfirmPassword);
      });
  }
}
