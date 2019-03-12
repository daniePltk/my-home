import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

// export interface IResponse<Object> {
//   houses: Array<any>;
// }

export interface House<Object> {
  'coords': {
    'lat': number,
    'lon': number
  };
  'params': {
    'rooms': number,
    'value': number
  };
  'street': string;
  'distance': number;
}
export interface Houses<Array> {
  houses: House[];
}
export interface BasePoint {
  lon: number;
  lat: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'My Home';
  //houses: Array<any> = [];
  //dataObj: IResponse<Object>;
  houses: Houses[];
  list1: Array<number> = [];
  list2: Array<string> = [];
  list3: Array<number> = [];
  templist: any;
  // basePoint: BasePoint;
  basePoint: BasePoint = {
    lon: 0,
    lat: 0
  };

  constructor(private service: AppService) {
  }

  ngOnInit() {
    this.service.getAllHousesFromApi().subscribe(
      data => {
        this.houses = Object.assign(data.houses); // Storing all the data in order to optimize performance and avoid unnecessary web calls
        for (let i = 0; i < this.houses.length; i++) {
          if (this.houses[i].params !== undefined && this.houses[i].params.rooms > 5) {
            this.list1.push(this.houses[i].params.rooms);
            this.list1.sort((a, b) => a - b);
          }
          // Since the Street names are already sorted alphabetically
          this.list2.push(this.houses[i].street);
          this.list2.sort(); // This step is unnecessary in case the results already sorted.
          // Handle basePoint for Distance measure
          if (this.houses[i].street !== undefined && this.houses[i].street === 'Eberswalder Straße 55') {
            this.basePoint.lat = this.houses[i].coords.lat;
            this.basePoint.lon = this.houses[i].coords.lon;
            this.templist = this.basePoint;
          }
          // this.list3.push(this.houses[i]);
        }
      }
    );
  }

  getDistanceByCord(lat1, lon1, lat2, lon2) {
    const R = 6371; // Constant as earth radius in km
    let disLat = this.deg2rad(lat2 - lat1);
    let disLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(disLat / 2) * Math.sin(disLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(disLon / 2) * Math.sin(disLon / 2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
