import { BikeService } from './../_services/bike.service';
import { StationService } from './../_services/station.service';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../_models/userInfo';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Convert, Pagination } from '../_models/pagination';
import { Station } from '../_models/station';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UserInfo;
  pageSize = 5;
  pageLinkSize = 5;

  historyPages: Pagination;
  stationPages: Pagination;

  stationList: Station[];
  station: Station;
  keyword: string = "";
  pageNum: number;

  tmpSelect: string;
  rentForm: FormGroup;

  returnForm = new FormGroup({
    stationId: new FormControl('')
  });

  addForm = new FormGroup({
    amount: new FormControl('')
  });

  apiLoaded$: Observable<boolean>;
  apiLoaded: boolean = false;
  googleApiKey = environment.googleApiKey;

  zoom: -10;
  center: google.maps.LatLngLiteral = { lat: 24.146510, lng: 120.673600 };
  markers: google.maps.LatLngLiteral[] = [];

  constructor(public accountService: AccountService,
    private stationService: StationService,
    private bikeService: BikeService,
    private httpClient: HttpClient) {
    this.apiLoaded$ = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}`, 'callback')
      .pipe(
        map(() => this.apiLoaded = true), catchError(() => of(this.apiLoaded = false))
      );
  }

  ngOnInit(): void {
    this.getHistoryRoutes(1, this.pageSize);
    this.getStationList(1, this.pageSize);
  }

  getHistoryRoutes(pageNum: number, pageSize: number) {
    return this.accountService.getHistoryRoutes(pageNum, pageSize).subscribe(
      (res: HttpResponse<UserInfo>) => {
        this.user = res.body;
        this.historyPages = Convert.toPagination(res.headers.get('x-pagination'));
        this.historyPages = Convert.generatePageLinks(this.historyPages);

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
        this.buildForm(this.stationList);

        this.rentForm.controls['bikeId'].setValue(null);
        this.rentForm.controls['stationId'].setValue(this.stationList[0].id);
        this.returnForm.controls['stationId'].setValue(this.stationList[0].id);

        this.stationPages = Convert.toPagination(res.headers.get('x-pagination'));
        this.stationPages = Convert.generatePageLinks(this.stationPages, this.pageLinkSize);
      }, error => {
        console.log(error);
      });
  }

  buildForm(formData: Station[]) {
    let form = {};
    for (let index = 0; index < formData.length; index++) {
      const element = formData[index];
      form[element.id + '_bike'] = new FormControl();
    }
    this.tmpSelect = this.stationList[0].id + '_bike';
    form['stationId'] = new FormControl({ value: formData[0].id });
    form['bikeId'] = new FormControl('');
    this.rentForm = new FormGroup(form);
  }

  rentBike() {
    //console.log(this.rentForm.value);
    if (this.rentForm.controls['bikeId'].value) {
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

  addMarker(lat: number, lng: number) {
    this.markers = [];
    this.markers.push({ lat: lat, lng: lng });
  }

  setBike(event: any) {
    var id = (<HTMLInputElement>event.target).value;
    this.rentForm.controls['bikeId'].setValue(id);
  }

  changeStation(station: Station, event: Event) {
    event.preventDefault();
    if (!this.tmpSelect.search(this.rentForm.get('stationId').value)) {
      if (this.rentForm.get('stationId').value != station.id) {
        this.rentForm.get(this.tmpSelect).setValue(null);
      }
    }
    this.tmpSelect = station.id + '_bike';
    this.rentForm.controls['bikeId'].setValue(null);

    this.rentForm.controls['stationId'].setValue(station.id);
    this.center = {
      lat: station.latitude,
      lng: station.longitude
    };
    this.addMarker(station.latitude, station.longitude);
  }

  changeReturnStation(station: Station) {
    this.returnForm.controls['stationId'].setValue(station.id);
    this.center = {
      lat: station.latitude,
      lng: station.longitude
    };
    this.addMarker(station.latitude, station.longitude);
  }
}
