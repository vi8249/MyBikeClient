import { Bike } from '../_models/bike';
import { BikeService } from './../_services/bike.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Convert, Pagination } from '../_models/pagination';
import { DashboardService } from '../_services/dashboard.service';

@Component({
  selector: 'app-bikes',
  templateUrl: './bikes.component.html',
  styleUrls: ['./bikes.component.css'],
})
export class BikesComponent implements OnInit {
  bike: Bike;
  bikeList: Bike[];
  pageNum = 1;
  pageSizeList = [20, 25, 30];
  pageSize: number = this.pageSizeList[0];
  pagination: Pagination;
  keyword: string = '';
  pageLinkSize: number = 6;

  constructor(
    public bikeService: BikeService,
    public dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.getBikeList(this.pageNum, this.pageSize, this.pageLinkSize);
  }

  getBikeList(pageNum: number, pageSize: number, pageLinkSize: number) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;

    this.bikeService.getBikes(pageNum, pageSize, this.keyword).subscribe(
      (res: HttpResponse<Bike[]>) => {
        this.bikeList = res.body;
        this.bike = this.bikeList[0];
        this.pagination = Convert.toPagination(res.headers.get('x-pagination'));
        this.pagination = Convert.generatePageLinks(this.pagination);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getBike(id: number) {
    this.bikeService.getBike(id).subscribe(
      (res: Bike) => {
        this.bike = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editBike() {
    this.bikeService.editBike(this.bike).subscribe(
      (res) => {
        this.getBikeList(this.pageNum, this.pageSize, this.pageLinkSize);
      },
      (error) => {
        console.log(error);
      },
      () => {
        //console.log();
      }
    );
  }

  deleteBike() {
    this.bikeService.deleteBike(this.bike.id).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
