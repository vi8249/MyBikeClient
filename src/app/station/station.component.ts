import { DashboardService } from './../_services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Convert, Pagination } from '../_models/pagination';
import { StationService } from '../_services/station.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Station } from '../_models/station';
import { BikeType } from '../_models/enum/bikeType';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css'],
})
export class StationComponent implements OnInit {
  station: Station;
  stationList: Station[];
  pageNum = 1;
  pageSizeList = [20, 25, 30];
  pageSize: number = this.pageSizeList[0];
  pagination: Pagination;
  keyword: string = '';
  pageLinkSize: number = 6;

  apiLoaded$: Observable<boolean>;
  googleApiKey = environment.googleApiKey;

  zoom: 18;
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  markers: google.maps.LatLngLiteral[] = [];

  constructor(
    public stationService: StationService,
    public dashboardService: DashboardService,
    httpClient: HttpClient
  ) {
    this.apiLoaded$ = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    this.getStationList(this.pageNum, this.pageSize);
  }

  getStationList(pageNum: number, pageSize: number) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;

    this.stationService.getStations(pageNum, pageSize, this.keyword).subscribe(
      (res: HttpResponse<Station[]>) => {
        this.stationList = res.body;
        this.station = this.stationList[0];
        this.pagination = Convert.toPagination(res.headers.get('x-pagination'));
        this.pagination = Convert.generatePageLinks(this.pagination);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getStation(id: string) {
    this.stationService.getStation(id).subscribe(
      (res: Station) => {
        this.station = res;
        this.center = {
          lat: this.station.latitude,
          lng: this.station.longitude,
        };
        this.addMarker(this.station.latitude, this.station.longitude);
        for (var type in BikeType) {
          switch (BikeType[type]) {
            case 'Electric':
              this.station.Electric = this.station.availableBikes.filter(
                (b) => b.bikeType == BikeType[type]
              ).length;
              break;
            case 'Road':
              this.station.Road = this.station.availableBikes.filter(
                (b) => b.bikeType == BikeType[type]
              ).length;
              break;
            case 'Hybrid':
              this.station.Hybrid = this.station.availableBikes.filter(
                (b) => b.bikeType == BikeType[type]
              ).length;
              break;
            case 'Lady':
              this.station.Lady = this.station.availableBikes.filter(
                (b) => b.bikeType == BikeType[type]
              ).length;
              break;
            default:
              break;
          }
        }
        //console.log(this.station);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editStation() {
    this.stationService.editStation(this.station).subscribe(
      (res) => {
        this.getStationList(this.pageNum, this.pageSize);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteStation() {
    this.stationService.deleteStation(this.station.id).subscribe(
      (res) => {
        //console.log(res);
        this.dashboardService
          .updateDashboard()
          .catch((error) => console.log(error));
        this.getStationList(this.pageNum, this.pageSize);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addMarker(lat, lng) {
    this.markers.push({ lat, lng });
  }
}
