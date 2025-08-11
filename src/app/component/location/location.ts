import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LocationService } from '../../service/location.service';
import { CellInfo, PhoneLocation} from '../../model/cell-location.model';

@Component({
  selector: 'app-location',
  imports: [
    MatCardModule,
    FormsModule,
    GoogleMap,
    MapAdvancedMarker,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './location.html',
  styleUrl: './location.scss'
})

export class Location {
  cellInfo: CellInfo = { mcc: 404, mnc: 5, lac: 59929, cid: 227936287 }
  markerPosition: google.maps.LatLngLiteral = {lat: 0, lng:0};
  
  options: google.maps.MapOptions = {
    mapId: "Cell-Location-Id",
    center: {lat: 0, lng: 0},
    zoom: 3
  }

  constructor (private locationService: LocationService) {}

  findLocation () {
    console.log('calling find location')
    this.locationService.getLiveLocation(this.cellInfo).subscribe(data => {
      console.log('data : ', data);
      this.markerPosition.lat = Number(data.latitude);
      this.markerPosition.lng = Number(data.longitude);
    });
  }

}
