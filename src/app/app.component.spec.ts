import { getTestBed, TestBed, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { request } from 'http';
import { HousesFixture } from '../assets/houses.mock';

describe('AppComponent', () => {
  let appService: AppService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [AppService]
    }).compileComponents();

    const testBed = getTestBed();
    appService = testBed.get(AppService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the title in side .main-header element', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('My Home');
    expect(compiled.querySelector('.main-header').textContent).toContain('My Home');
  });

  it('should assert the desc order by rooms number in the apartment ', () => {

    // This will refer to mock houses data
    const data = HousesFixture.houses;
    const rooms = data.rooms;
    rooms.forEach((n) => {
      expect(n).toEqual(n > 5);
    });

  });
});

// describe('Houses Data check', () => {
//   let appService: AppService;
//   let httpMock: HttpTestingController;
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [AppService]
//     }).compileComponents();
//
//     const testBed = getTestBed();
//     appService = testBed.get(AppService);
//     httpMock = testBed.get(HttpTestingController);
//   }));
//
//   it('should return an Observable<Product[]>', inject([HttpTestingController, AppService],
//     (httpMock: HttpTestingController, service: AppService) => {
//
//       const housesMock = [
//         {
//           'coords': {
//             'lat': 52.5013632,
//             'lon': 13.4174913
//           },
//           'params': {
//             'rooms': 5,
//             'value': 1000000
//           },
//           'street': 'Adalbertstraße 13'
//         },
//         {
//           'coords': {
//             'lat': 52.4888151,
//             'lon': 13.3147011
//           },
//           'params': {
//             'value': 1000000
//           },
//           'street': 'ZBrandenburgische Straße 10'
//         },
//         {
//           'coords': {
//             'lat': 52.5141632,
//             'lon': 13.3780111
//           },
//           'params': {
//             'rooms': 3,
//             'value': 1500000
//           },
//           'street': 'Cora-Berliner-Straße 22'
//         },
//         {
//           'coords': {
//             'lat': 52.53931,
//             'lon': 13.4206011
//           },
//           'params': {
//             'rooms': 12,
//             'value': 5000000
//           },
//           'street': 'Danziger Straße 66'
//         },
//         {
//           'coords': {
//             'lat': 52.5418739,
//             'lon': 13.4057378
//           },
//           'params': {
//             'rooms': 10,
//             'value': 4000000
//           },
//           'street': 'Eberswalder Straße 55'
//         },
//         {
//           'coords': {
//             'lat': 52.5336332,
//             'lon': 13.4015613
//           },
//           'street': 'Fehrbelliner Straße 23'
//         },
//         {
//           'coords': {
//             'lat': 52.5269281,
//             'lon': 13.3984283
//           },
//           'params': {
//             'rooms': 20,
//             'value': 7000000
//           },
//           'street': 'Gipsstraße 44'
//         },
//         {
//           'coords': {
//             'lat': 52.4858232,
//             'lon': 13.4215013
//           },
//           'params': {
//             'rooms': 18,
//             'value': 2000000
//           },
//           'street': 'Hermannstraße 1'
//         },
//         {
//           'coords': {
//             'lat': 52.4863064,
//             'lon': 13.3385237
//           },
//           'params': {
//             'rooms': 12,
//             'value': 2300000
//           },
//           'street': 'Innsbrucker Straße 8'
//         },
//         {
//           'coords': {
//             'lat': 52.4896432,
//             'lon': 13.3329913
//           },
//           'params': {
//             'rooms': 8,
//             'value': 800000
//           },
//           'street': 'Jenaer Straße 8'
//         }
//       ];
//       const fixture = TestBed.createComponent(AppComponent);
//       appService.getAllHousesFromApi().subscribe((data) => {
//         expect(data.length).toBe(10);
//       });
//
//       const req = httpMock.expectOne('./assets/houses.json');
//       expect(req.request.method).toBe('GET');
//       req.flush(housesMock);
//       httpMock.verify();
//     }));
// });
