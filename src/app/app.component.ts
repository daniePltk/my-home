import { AfterContentInit, Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { MapsAPILoader } from '@agm/core';
import { finalize } from 'rxjs/operators';
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
  housesSortedByRoomsNum: Array<House> = [];
  housesWithoutFullInfo: Array<House> = [];
  housesSortedByClosenessToSister: Array<House> = [];
  basePoint: BasePoint = {
    lon: 0,
    lat: 0
  };
  zoom = 11;
  markers = [];
  housescords = [];
  housesAllInfo = [];
  distanceInKm;
  inCriteriaHouses: Array<House> = [];
  myFinalHome: House;

  constructor(private service: AppService,
              private mapsAPILoader: MapsAPILoader) {
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
            }).finally(() => {
              // Sorting the houses with the optional property 'distanceFromSister'
              this.housesAllInfo.sort((a, b) => a.distanceFromSister - b.distanceFromSister);
            });
            this.housesAllInfo.push(this.houses[i]);
          }
          if (this.houses[i].params !== undefined && this.houses[i].params.rooms > 5) {
            this.housesSortedByRoomsNum.push(this.houses[i]);
            this.housesSortedByRoomsNum.sort((a, b) => a.params.rooms - b.params.rooms);
          }
          if (!(this.houses[i].hasOwnProperty('params') && this.houses[i].params.hasOwnProperty('rooms') && this.houses[i].params.hasOwnProperty('value'))) {
            this.housesWithoutFullInfo.push(this.houses[i]);
            this.housesWithoutFullInfo.sort(this.streetSortByName('street'));
          }
          if (this.houses[i].params !== undefined) {
            if (this.houses[i].params.value !== undefined &&
              this.houses[i].params.rooms !== undefined && this.houses[i].street !== 'Eberswalder Straße 55' &&
              this.houses[i].params.rooms >= 10 && this.houses[i].params.value <= 5000000) {
              this.inCriteriaHouses.push(this.houses[i]);
            }
          }
        }
        // Since the list will be sorted according closest distance and filtered by other criteria we pick the first instance
        this.myFinalHome = this.inCriteriaHouses[0];

        this.markers = this.getLocations();
        this.mapsAPILoader.load().then(() => {
          const sistersHouse = new google.maps.LatLng(this.basePoint.lat, this.basePoint.lon);
          this.housescords = this.markers.filter(m => {
            const markerLoc = new google.maps.LatLng(m.lat, m.lon);
            this.distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markerLoc, sistersHouse);
            this.housesSortedByClosenessToSister.push(this.distanceInKm);
            this.housesSortedByClosenessToSister.sort();
            return m;
          });
        });
      });
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

