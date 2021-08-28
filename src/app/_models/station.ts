export interface Station {
  id: string;
  stationName: string;
  avalidableParkingSpace: number;
  createTime: Date;
  updateTime: Date;
  latitude: number;
  longitude: number;
  availableBikes: IAvailableBike[];

  Electric: number;
  Road: number;
  Hybrid: number;
  Lady: number;
}

interface IAvailableBike {
  id: number;
  mileage: number;
  rented: boolean;
  bikeType: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toTemperatures(json: string): Station {
    return JSON.parse(json);
  }

  public static temperaturesToJson(value: Station): string {
    return JSON.stringify(value);
  }
}
