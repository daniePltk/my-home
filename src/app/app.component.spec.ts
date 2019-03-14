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

  });
});
