import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';


export interface House {
  coords: {
    lat: number,
    lon: number
  };
  params: {
    rooms: number,
    value: number
  };
  street: string;
  distance: number;
}

export interface Houses {
  houses: Array<House>;
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
  houses: Houses;
  // list1: Array<number> = [];
  // list2: Array<string> = [];
  // list3: Array<number> = [];
  list1: Array<House> = [];
  list2: Array<House> = [];
  list3: Array<object> = [];
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
        for (let i = 0; i < data.houses.length; i++) {
          if (this.houses[i].params !== undefined && this.houses[i].params.rooms > 5) {
            this.list1.push(this.houses[i]);
            this.list1.sort((a, b) => a.params.rooms - b.params.rooms);
          }
          if (!(this.houses[i].hasOwnProperty('params') && this.houses[i].params.hasOwnProperty('rooms') && this.houses[i].params.hasOwnProperty('value'))) {
            this.list2.push(this.houses[i]);
            this.list2.sort(this.streetSortByName('street'));
          }
          // Handle basePoint for Distance measure
          if (this.houses[i].street !== undefined && this.houses[i].street === 'Eberswalder Straße 55') {
            this.basePoint.lat = this.houses[i].coords.lat;
            this.basePoint.lon = this.houses[i].coords.lon;
            this.templist = this.basePoint;
          }
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


  streetSortByName(prop) {
    return (a, b) => {
        return a[prop].localeCompare(b[prop]);
    };
  }
}
