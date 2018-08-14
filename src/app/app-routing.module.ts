import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {WeatherComponent} from './weather/weather.component';

const routes: Routes = [
  {path: 'weather/:searchTerm', component: WeatherComponent},
  {path: 'weather', component: WeatherComponent},
  {path: 'app', component: WeatherComponent, pathMatch: 'full'},
  {path: '**', component: WeatherComponent, pathMatch: 'full'},
  {path: '', component: WeatherComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
