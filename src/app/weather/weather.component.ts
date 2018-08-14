import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ChartData {
  'name': any;
  'value': number;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  @ViewChild('weatherLocation') weatherLocation: ElementRef;
  public fiveDayForecast: Observable<any>;
  // private apiKey = '1aa9e73439a8e0de3947c1bfe4b34a06';
  private apiKey = '350aae3d57fe45b1a8a48ec22e60dfa8';
  public badZipMsg = '';
  public loadingWeather = false;
  private tempMap = new Map();
  public searchTerm: string;
  public lastSearchTerm = '';
  public cityParam: string;

  /*charts*/
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  results: any[];
  yAxisLabel = 'Temperature';
  view: any[] = [1000, 400];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  title = 'app';

  realData = [
    {
      'name': 'Temp',
      'series': []
    },
    {
      'name': 'Humidity',
      'series': []
    }
  ];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParamMap.subscribe(params => {
      console.log('search Term is ', this.searchTerm);
      console.log(params);
      this.searchTerm = (params ? params.get('searchTerm') : null);
      console.log('search Term is ', this.searchTerm);
      if (this.searchTerm && (this.searchTerm !== this.lastSearchTerm)) {
        this.getForecast(this.searchTerm);
      } else {
        // we already ran that search
      }
    });
  }

  ngOnInit() {
    /* if (this.searchTerm && this.weatherLocation.nativeElement) {
       this.weatherLocation.nativeElement.value = this.searchTerm;
       if (this.lastSearchTerm === this.searchTerm) {
         // this.addSearchTermToUrl();
         console.log('we already searched for ', this.searchTerm );
         return; // don't do anything as we are showing this data already
       } else {
         this.getForecast(this.searchTerm);
       }
     }*/
  }

  updateUrl() {
    this.searchTerm = this.weatherLocation.nativeElement.value;
    this.router.navigate(['/weather'], {queryParams: {'searchTerm': this.searchTerm}});
  }

  getForecast(searchTerm?: any) {
    let searchType: string;
    if (this.weatherLocation) {
      this.weatherLocation.nativeElement.value = searchTerm;
    }

    if (!isNaN(+searchTerm)) {
      this.badZipMsg = '';
      // it's a number/ so make it's the right length and it's 5 characters
      if (searchTerm.length !== 5) {  // this could have been more complex with a regex
        this.badZipMsg = 'Please ensure that you entered a zip code of exactly 5 numbers';
        return;
      }
      searchType = 'zip';
    } else {
      searchType = 'q';
    }
    if (this.lastSearchTerm.toLowerCase() === searchTerm.toLocaleLowerCase()) {
      console.log('tried to redo the previous search');
      return;
    }

    this.loadingWeather = true;

    this.http.get<any>(
      `https://api.openweathermap.org/data/2.5/forecast?${searchType}=${searchTerm}&lang=en&units=imperial&appid=${this.apiKey}`
    )
      .subscribe(
        f => {
          this.fiveDayForecast = f;
          this.realData[0].series = [];
          this.realData[1].series = [];
          f.list.map(v => {
            this.realData[0].series.push({'name': v.dt_txt, 'value': v.main.temp});
            this.realData[1].series.push({'name': v.dt_txt, 'value': v.main.humidity});
            // this.addSearchTermToUrl();
          });

        },
        err => {
          console.log(' an error occurred in the open weather api call', err);
        },
        () => {
          this.getUpdatedChart();
          if (this.weatherLocation) {
            this.weatherLocation.nativeElement.value = this.searchTerm;
          }
          this.lastSearchTerm = searchTerm;
          this.loadingWeather = false;
          // this.router.navigate(['/app'], {queryParams: {searchTerm: this.searchTerm}});
        }
      );
  }

  addSearchTermToUrl() {
    // changes the route without moving from the current view or
    // triggering a navigation event
    // this.router.navigate([], { relativeTo: this.route, queryParams: { 'searchTerm': this.searchTerm }});


  }

  getUpdatedChart() {
    if (this.realData[0].series.length > 2) {
      this.results = [...this.realData];
    }
  }
}
