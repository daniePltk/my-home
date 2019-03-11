import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IResponse<object> {
  houses: Array<any>;
}

@Injectable()
export class AppService {
  housesResponseData: Array<any> = [ ];
  dataObj: object;
  constructor(private httpService: HttpClient) {
    this.getAllHousesFromApi().subscribe(
      data => {

        // this.dataObj = JSON.parse(data);
        this.dataObj = data;
        this.housesResponseData.push(this.dataObj.houses);
        console.log(this.housesResponseData);
      }
    );
  }

  getAllHousesFromApi(): Observable<IResponse> {
    return this.httpService.get<IResponse>('./assets/houses.json');
  }
}
