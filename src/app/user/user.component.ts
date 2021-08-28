import { BikeService } from './../_services/bike.service';
import { StationService } from './../_services/station.service';
import { BikeType } from './../_models/enum/bikeType';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../_models/userInfo';
import { HttpResponse } from '@angular/common/http';
import { Convert, Pagination } from '../_models/pagination';
import { Station } from '../_models/station';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UserInfo;
  pageSize = 5;
  pageLinkSize = 5;
  pagination1: Pagination;
  pagination2: Pagination;
  pagination3: Pagination;
  types: Array<string>;
  stationList: Station[];
  station: Station;
  keyword: string = "";
  pageNum: number;


  rentForm = new FormGroup({
    stationId: new FormControl(''),
    bikeId: new FormControl(''),
  });

  returnForm = new FormGroup({
    stationId: new FormControl('')
  });

  addForm = new FormGroup({
    amount: new FormControl('')
  });

  constructor(public accountService: AccountService, private stationService: StationService, private bikeService: BikeService) { }

  ngOnInit(): void {
    this.getHistoryRoutes(1, this.pageSize);
    this.getStationList(1, this.pageSize);
  }

  getHistoryRoutes(pageNum: number, pageSize: number) {
    return this.accountService.getHistoryRoutes(pageNum, pageSize).subscribe(
      (res: HttpResponse<UserInfo>) => {
        //console.log(res.headers);
        this.user = res.body;
        this.pagination1 = Convert.toPagination(res.headers.get('x-pagination'));
        this.pagination1 = Convert.generatePageLinks(this.pagination1);
        if (this.user.historyRoute[0] != null && this.user.historyRoute[0].returnTime.toString() == "0001-01-01T00:00:00")
          this.user.historyRoute[0].returnTime = null;
      }, error => {
        console.log(error);
      }
    )
  }

  getStationList(pageNum: number, pageSize: number) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;

    this.stationService.getStations(pageNum, pageSize, this.keyword)
      .subscribe((res: HttpResponse<Station[]>) => {
        this.stationList = res.body;
        this.rentForm.controls['stationId'].setValue(this.stationList[0].id);
        this.returnForm.controls['stationId'].setValue(this.stationList[0].id);
        this.rentForm.controls['bikeId'].setValue(null);
        this.pagination2 = Convert.toPagination(res.headers.get('x-pagination'));
        this.pagination2 = Convert.generatePageLinks(this.pagination2, this.pageLinkSize);
      }, error => {
        console.log(error);
      });
  }

  rentBike() {
    if (this.rentForm.controls['bikeId'].value) {
      //console.log(this.rentForm.value);
      this.bikeService.rentBike(this.rentForm.controls['bikeId'].value).subscribe(() => {
        this.getHistoryRoutes(1, this.pageSize);
      }, error => {
        console.log(error);
      })
    }
    else {
      console.log('error');
    }
  }

  returnBike() {
    if (this.returnForm.controls['stationId'].value) {
      //console.log(this.returnForm.value);

      this.bikeService.returnBike(
        this.returnForm.controls['stationId'].value,
        this.user.bike).subscribe(res => {
          this.getHistoryRoutes(1, this.pageSize);
        }, error => {
          console.log(error);
        })
    } else {
      console.log('error');
    }
  }

  addValue() {
    if (this.addForm.controls['amount'].value > 0)
      this.accountService.addValue(this.addForm.controls['amount'].value).subscribe(res => {
        //console.log(res);
        this.getHistoryRoutes(1, this.pageSize);
      }, error => {
        console.log(error);
      })
  }
}
