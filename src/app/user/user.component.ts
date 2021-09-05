import { ToastrService } from 'ngx-toastr';
import { DashboardService } from './../_services/dashboard.service';
import { BikeService } from './../_services/bike.service';
import { StationService } from './../_services/station.service';
import { AccountService } from './../_services/account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInfo } from '../_models/userInfo';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Convert, Pagination } from '../_models/pagination';
import { Station } from '../_models/station';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  currentUser: User;
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
    private toastrService: ToastrService,
    private httpClient: HttpClient,
    private dashboardService: DashboardService) {
    this.apiLoaded$ = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}`, 'callback')
      .pipe(
        map(() => this.apiLoaded = true), catchError(() => of(this.apiLoaded = false))
      );
  }

  ngOnInit(): void {
    this.getHistoryRoutes(1, this.pageSize);
    this.getStationList(1, this.pageSize);
    //this.accountService.currentUser$.subscribe((res: User) => this.currentUser = res);
    //this.dashboardService.createHubConnection(this.currentUser);
  }

  ngOnDestroy(): void {
    //this.dashboardService.stopHubConnection();
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
        this.setMapConfig(this.stationList[0]);

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
    this.rentForm = new FormGroup(form);
  }

  rentBike() {
    //console.log(this.rentForm.value);
    const station = this.rentForm.get('stationId').value

    if (this.rentForm.get(station + '_bike').value) {
      this.bikeService.rentBike(this.rentForm.get(station + '_bike').value)
        .subscribe((res: any) => {
          this.getHistoryRoutes(1, this.pageSize);
          this.dashboardService.updateDashboard().then(() => {
            //console.log('update dashboard');
          });
          this.toastrService.info(res.value);
        }, error => {
          console.log(error);
          this.toastrService.warning(error.error);
        })
    }
    else {
      console.log('error');
    }
  }

  returnBike() {
    if (this.returnForm.controls['stationId'].value) {
      this.bikeService.returnBike(
        this.returnForm.controls['stationId'].value,
        this.user.bike).subscribe((res: any) => {
          this.getHistoryRoutes(1, this.pageSize);
          this.dashboardService.updateDashboard().then(() => {
            //console.log('update dashboard');
          });
          this.toastrService.info(res.value);
        }, error => {
          console.log(error);
          this.toastrService.warning(error.error);
        })
    } else {
      console.log('error');
    }
  }

  addValue() {
    if (this.addForm.controls['amount'].value > 0)
      this.accountService.addValue(this.addForm.controls['amount'].value)
        .subscribe((res: any) => {
          this.getHistoryRoutes(1, this.pageSize);
          this.toastrService.info(res.value)
        }, error => {
          console.log(error);
          this.toastrService.warning(error.error)
        })
  }

  // map configure
  addMarker(lat: number, lng: number) {
    this.markers = [];
    this.markers.push({ lat: lat, lng: lng });
  }

  // setBike(event: any) {
  //   var id = (<HTMLInputElement>event.target).value;
  //   this.rentForm.controls['bikeId'].setValue(id);
  //   console.log(this.rentForm.value);
  // }

  setMapConfig(station: Station) {
    this.center = {
      lat: station.latitude,
      lng: station.longitude
    };
    this.addMarker(station.latitude, station.longitude);
  }

  changeStation(station: Station, event: Event) {
    event.preventDefault();

    if (!this.tmpSelect.search(this.rentForm.get('stationId').value)) {
      if (this.rentForm.get('stationId').value != station.id) {
        this.rentForm.get(this.tmpSelect).setValue(null);
      }
    }

    this.tmpSelect = station.id + '_bike';
    this.rentForm.controls['stationId'].setValue(station.id);
    this.setMapConfig(station);

    //console.log(this.rentForm.value);
  }

  changeReturnStation(station: Station) {
    this.returnForm.controls['stationId'].setValue(station.id);
    this.setMapConfig(station);
  }
}
