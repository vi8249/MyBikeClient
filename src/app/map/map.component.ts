import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() center: any;
  @Input() markers: any;
  @Input() zoom: any;

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: -10,
  }

  constructor() { }

  ngOnInit(): void {
    //console.log(this.marker);
  }

}
