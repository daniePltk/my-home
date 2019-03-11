import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-home';
  data;
  constructor(private getHousesService: AppService ) {
    this.data = this.getHousesService.housesResponseData;
  }
}
