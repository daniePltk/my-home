import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { MapsAPILoader } from '@agm/core';
declare var google;


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
  distanceFromSister?: number;
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
  houses: Houses;
  list1: Array<House> = [];
  list2: Array<House> = [];
  list3: Array<House> = [];
  basePoint: BasePoint = {
    lon: 0,
    lat: 0
  };
  zoom = 11;
  markers = [];
  filteredMarkers = [];
  housescords = [];
  housesAllInfo = [];
  distanceInKm;
  in_criteria_houses = []
  constructor(private service: AppService, private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.service.getAllHousesFromApi().subscribe(
      data => {
        this.houses = Object.assign(data.houses); // Storing all the data in order to optimize performance and avoid unnecessary web calls
        for (let i = 0; i < data.houses.length; i++) {
          if (this.houses[i].street === 'Eberswalder Straße 55') {
            this.basePoint.lat = this.houses[i].coords.lat;
            this.basePoint.lon = this.houses[i].coords.lon;
          } else {
            this.housescords.push(this.houses[i].coords);
            this.mapsAPILoader.load().then(() => {
              const sistersHouse = new google.maps.LatLng(this.basePoint.lat, this.basePoint.lon);
              const markerLoc = new google.maps.LatLng(this.houses[i].coords.lat, this.houses[i].coords.lon);
              const distance = google.maps.geometry.spherical.computeDistanceBetween(markerLoc, sistersHouse);
              this.houses[i].distanceFromSister = distance;
            });
            this.housesAllInfo.push(this.houses[i]);
          }
          if (this.houses[i].params !== undefined && this.houses[i].params.rooms > 5) {
            this.list1.push(this.houses[i]);
            this.list1.sort((a, b) => a.params.rooms - b.params.rooms);
          }
          if (!(this.houses[i].hasOwnProperty('params') && this.houses[i].params.hasOwnProperty('rooms') && this.houses[i].params.hasOwnProperty('value'))) {
            this.list2.push(this.houses[i]);
            this.list2.sort(this.streetSortByName('street'));
          }
          // console.log( this.houses[i].params !== undefined);
          if (this.houses[i].params !== undefined) {
            if (this.houses[i].params.value !== undefined &&
              this.houses[i].params.rooms !== undefined && this.houses[i].street !== 'Eberswalder Straße 55' &&
              this.houses[i].params.rooms >= 10 && this.houses[i].params.value <= 5000000) {
              this.in_criteria_houses = this.houses[i];
              console.log(this.houses[i]);
            }
          }
        }
        this.markers = this.getLocations();
        this.mapsAPILoader.load().then(() => {
          const sistersHouse = new google.maps.LatLng(this.basePoint.lat, this.basePoint.lon);
          this.housescords = this.markers.filter(m => {
            const markerLoc = new google.maps.LatLng(m.lat, m.lon);
            this.distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markerLoc, sistersHouse);
            this.list3.push(this.distanceInKm);
            this.list3.sort();
            return m;
          });
        });
        this.housesAllInfo.sort((a, b) => a.distanceFromSister - b.distanceFromSister);
        console.log('house records', this.housesAllInfo);
      });
    // this.housesAllInfo.sort((a, b) => a.distanceFromSister - b.distanceFromSister);
    // console.log('house records', this.housesAllInfo);
  }
  getLocations(): Array<{ latitude: number, longitude: number }> {
    return this.housescords;
  }
  // ToDo Refactor to General Functions
  streetSortByName(prop: any) {
    return (a: any, b: any) => {
      return a[prop].localeCompare(b[prop]);
    };
  }
}
