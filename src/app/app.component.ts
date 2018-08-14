import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {shareReplay, tap} from 'rxjs/internal/operators';
import {ActivatedRoute, Router} from '@angular/router';

export interface ChartData {
  'name': any;
  'value': number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit() {


  }
}
