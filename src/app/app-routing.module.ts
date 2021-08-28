import { UserComponent } from './user/user.component';
import { PriceComponent } from './price/price.component';
import { StationComponent } from './station/station.component';
import { BikesComponent } from './bikes/bikes.component';
import { HomeComponent } from './home/home.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "bikes", component: BikesComponent },
  { path: "stations", component: StationComponent },
  { path: "pricing", component: PriceComponent },
  { path: "user", component: UserComponent },
  { path: "**", component: HomeComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
