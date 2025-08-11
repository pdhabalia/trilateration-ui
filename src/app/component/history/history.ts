import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import {PhoneLocation} from '../../model/cell-location.model'
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  MatSelectModule,
  MatSelect,
  MatSelectChange,
  MatSelectTrigger,
  MatOption
} from '@angular/material/select'
import { LocationService } from '../../service/location.service'

@Component({
  selector: 'app-history',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    GoogleMap,
    MapAdvancedMarker,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatTooltipModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  phoneNumbers: string[] = []
  phoneLocations: PhoneLocation[] = []

  options: google.maps.MapOptions = {
    mapId: 'Cell-Location-Id',
    center: { lat: 0, lng: 0 },
    zoom: 4
  }

  constructor (private locationService: LocationService) {}

  ngOnInit (): void {
    this.locationService.getPhoneNumbers().subscribe(data => {
      this.phoneNumbers = data;
    });
  }

  onSelectionChange (event: MatSelectChange) {
    this.locationService.getPhoneLocation(event.value).subscribe(data => {
      data.forEach(element => {
        this.phoneLocations.push({
          phoneNumber: element.phoneNumber,
          mcc: element.mcc,
          mnc: element.mnc,
          lac: element.lac,
          cid: element.lac,
          latitude: Number(element.latitude),
          longitude: Number(element.longitude),
          locationDateTime: element.locationDateTime,
          address: element.address
        });
      });
    });
  }

}
