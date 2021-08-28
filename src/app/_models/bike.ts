export interface Bike {
  id: number;
  mileage: number;
  rented: boolean;
  revenue: number;
  bikeType: string;
  bikeStationId: string;
  bikeStation: IStation;
  price: IPrice;
}

interface IStation {
  stationName: string;
}

interface IPrice {
  cost: number;
  discount: number;
}
