import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDf-yIqxErTkbWzKhLox7nAANnrfDIY190&libraries',
      libraries: ['geometry']
    })
  ],
  providers: [ AppService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
