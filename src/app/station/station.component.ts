import { Component, OnInit } from '@angular/core';
import { Convert, Pagination } from '../_models/pagination';
import { StationService } from '../_services/station.service';
import { HttpResponse } from '@angular/common/http';
import { Station } from '../_models/station';
import { BikeType } from '../_models/enum/bikeType';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  station: Station;
  stationList: Station[];
  pageNum = 1;
  pageSizeList = [20, 25, 30]
  pageSize: number = this.pageSizeList[0];
  pagination: Pagination;
  keyword: string = "";
  pageLinkSize: number = 9;

  constructor(public stationService: StationService) { }

  ngOnInit(): void {
    this.getStationList(this.pageNum, this.pageSize);
  }

  getStationList(pageNum: number, pageSize: number) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;

    this.stationService.getStations(pageNum, pageSize, this.keyword)
      .subscribe((res: HttpResponse<Station[]>) => {
        this.stationList = res.body;
        this.station = this.stationList[0];
        this.pagination = Convert.toPagination(res.headers.get('x-pagination'));
        this.pagination = Convert.generatePageLinks(this.pagination);
      }, error => {
        console.log(error);
      });
  }

  getStation(id: string) {
    this.stationService.getStation(id).subscribe(
      (res: Station) => {
        this.station = res;
        for (var type in BikeType) {
          switch (BikeType[type]) {
            case "Electric":
              this.station.Electric = this.station.availableBikes.filter(b => b.bikeType == BikeType[type]).length;
              break;
            case "Road":
              this.station.Road = this.station.availableBikes.filter(b => b.bikeType == BikeType[type]).length;
              break;
            case "Hybrid":
              this.station.Hybrid = this.station.availableBikes.filter(b => b.bikeType == BikeType[type]).length;
              break;
            case "Lady":
              this.station.Lady = this.station.availableBikes.filter(b => b.bikeType == BikeType[type]).length;
              break;
            default:
              break;
          }
        }
        //console.log(this.station);
      }, error => {
        console.log(error);
      }
    )
  }

  editStation() {
    this.stationService.editStation(this.station).subscribe(
      res => {
        this.getStationList(this.pageNum, this.pageSize);
      }, error => {
        console.log(error);
      }
    )
  }

  deleteStation() {
    this.stationService.deleteStation(this.station.id).subscribe(
      res => {
        console.log(res);
        this.getStationList(this.pageNum, this.pageSize);
      }, error => {
        console.log(error);
      }
    )
  }


}
