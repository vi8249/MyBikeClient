import { UserInfo } from './../_models/userInfo';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Convert, Pagination } from '../_models/pagination';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(res => {
      if (res?.admin)
        this.router.navigate(['/bikes']);
    });
  }

}
