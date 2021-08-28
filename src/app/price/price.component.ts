import { BikeService } from './../_services/bike.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  prices: any;

  constructor(private httpClient: HttpClient, private bikeService: BikeService) { }

  ngOnInit(): void {
    this.getPrice();
  }

  getPrice() {
    this.bikeService.getPrices().subscribe(res => {
      //console.log(res);
      this.prices = res;
    }, error => {
      console.log(error);
    })
  }

}
