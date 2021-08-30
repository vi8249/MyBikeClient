import { Router } from '@angular/router';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const admin = JSON.parse(localStorage.getItem('user'))?.admin;
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
      .subscribe(res => {
        // console.log(res);
      }, error => {
        console.log(error.error.errors);
        if (error.error.errors.Email)
          this.toastr.error(error.error.errors.Email);
        if (error.error.errors.Password)
          this.toastr.error(error.error.errors.Password);
        if (error.error.errors.ConfirmPassword)
          this.toastr.error(error.error.errors.ConfirmPassword);
      });
  }
}
