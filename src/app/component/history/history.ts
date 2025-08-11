import { CommonModule } from '@angular/common'
import { Component, OnInit, resource, signal } from '@angular/core'
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
import { delay } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

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
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  phoneNumbers: string[] = []
  phoneLocations: PhoneLocation[] = []

  loading = signal(false);

  phoneNumberResource = resource({ 
    loader: () => this.locationService.getPhoneNumbers(),
  });


  options: google.maps.MapOptions = {
    mapId: 'Cell-Location-Id',
    center: { lat: 0, lng: 0 },
    zoom: 4
  }

  constructor (private locationService: LocationService) {}

  async ngOnInit () {
    this.loading.set(true);
    const data = await this.locationService.getPhoneNumbers();
    this.phoneNumbers = data;
    this.loading.set(false);
  }

  async onSelectionChange (event: MatSelectChange) {

    console.log("Fetching location for phone number " + event.value);
    this.loading.set(true);

    const data = await this.locationService.getPhoneLocation(event.value);
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

      this.loading.set(false);
  }

}
