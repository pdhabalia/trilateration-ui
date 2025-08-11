import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms'
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { LocationService } from '../../service/location.service'
import { PhoneLocation } from '../../model/cell-location.model'

@Component({
  selector: 'app-location',
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
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
  loading = signal(false);

  cellInfo: PhoneLocation = {
    phoneNumber: '',
    mcc: 0,
    mnc: 0,
    lac: 0,
    cid: 0,
    latitude: 0,
    longitude: 0,
    locationDateTime: new Date(),
    address: ''
  }

  phoneInfo : PhoneLocation | undefined;

  form = new FormGroup( {
    phoneNumber : new FormControl<string>('', 
      [
        Validators.required, 
        Validators.pattern(/^\d+$/)
      ]
    ),
    mcc : new FormControl<number | null>(null, 
      [
        Validators.required, 
        Validators.min(1), 
        Validators.pattern(/^\d+$/)
      ]
    ),
    
    mnc : new FormControl<number | null>(null, 
      [
        Validators.required, 
        Validators.min(1), 
        Validators.pattern(/^\d+$/)
      ]
    ),
    lac : new FormControl<number | null>(null, 
      [
        Validators.required, 
        Validators.min(1), 
        Validators.pattern(/^\d+$/)
      ]
    ),
    
    cid : new FormControl<number | null>(null, 
      [
        Validators.required, 
        Validators.min(1), 
        Validators.pattern(/^\d+$/)
      ]
    )
  });

  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 }

  options: google.maps.MapOptions = {
    mapId: 'Cell-Location-Id',
    center: { lat: 0, lng: 0 },
    zoom: 3
  }

  constructor (private locationService: LocationService) {}

  async findLocation () {
    console.log('calling find location');
    this.loading.set(true);

    if(this.form.valid){
      let phoneInfo = this.form.value as PhoneLocation;
      console.log("CellInfo " , phoneInfo);
      const data = await this.locationService.getLiveLocation(phoneInfo);
      this.markerPosition.lat = Number(data.latitude);
      this.markerPosition.lng = Number(data.longitude);
    }
     this.loading.set(false);
  }
}

