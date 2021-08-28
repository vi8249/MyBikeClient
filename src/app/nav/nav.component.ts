import { Router } from '@angular/router';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  title = 'MyBike';
  model: any = {};

  constructor(public accountService: AccountService, private router: Router) { }

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
        console.log(error);
      });
  }
}
