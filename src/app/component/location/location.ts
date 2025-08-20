import { CommonModule } from '@angular/common'
import { Component, signal, ViewChild } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule
} from '@angular/forms'
import {
  GoogleMap,
  MapAdvancedMarker,
  MapInfoWindow
} from '@angular/google-maps'
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
    MapInfoWindow,
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
  @ViewChild('infoWindow') infoWindow!: MapInfoWindow

  /** Google Map releated properties */
  infoWindowVisible = false
  selectedMarkerData: PhoneLocation | null = null
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 }
  options: google.maps.MapOptions = {
    mapId: 'Cell-Location-Id',
    center: { lat: 0, lng: 0 },
    zoom: 3
  }

  loading = signal(false)

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

  phoneInfo: PhoneLocation | undefined

  form = new FormGroup({
    phoneNumber: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ]),
    mcc: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/)
    ]),

    mnc: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/)
    ]),
    lac: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/)
    ]),

    cid: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/)
    ])
  })

  constructor (private locationService: LocationService) {}

  async findLocation () {
    this.loading.set(true)

    if (this.form.valid) {
      let phoneInfo = this.form.value as PhoneLocation
      this.cellInfo = await this.locationService.getLiveLocation(phoneInfo)
      this.markerPosition.lat = Number(this.cellInfo.latitude)
      this.markerPosition.lng = Number(this.cellInfo.longitude)
    }
    this.loading.set(false)
  }

  showAddress (markerData: PhoneLocation, marker: MapAdvancedMarker) {
    // Set the selected marker data
    this.selectedMarkerData = markerData

    if (this.infoWindow) {
      // Open the info window anchored to the clicked marker
      this.infoWindow.open(marker)
      this.infoWindowVisible = true
    }
  }
}
