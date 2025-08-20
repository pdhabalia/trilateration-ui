import { CommonModule } from '@angular/common'
import { Component, OnInit, resource, signal, ViewChild } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { GoogleMap, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import {PhoneLocation, PhoneNumbers} from '../../model/cell-location.model'
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
    MapInfoWindow,
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
  @ViewChild('infoWindow') infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  phoneNumbers: string[] = []
  phoneLocations: PhoneLocation[] = []
  infoWindowVisible = false;
  selectedMarkerData: PhoneLocation | null = null;

  loading = signal(false);

  phoneNumberResource = resource({ 
    loader: () => this.locationService.getPhoneNumbers(),
  });


  options: google.maps.MapOptions = {
    mapId: 'Cell-Location-Id',
    center: { lat: 0, lng: 0 },
    zoom: 4
  }

  private calculateMapCenter(locations: PhoneLocation[]): google.maps.LatLngLiteral {
    if (locations.length === 0) {
      return { lat: 0, lng: 0 };
    }

    if (locations.length === 1) {
      return { lat: locations[0].latitude, lng: locations[0].longitude };
    }

    // Calculate the center point of all locations
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.latitude, lng: location.longitude });
    });

    const center = bounds.getCenter();
    return { lat: center.lat(), lng: center.lng() };
  }

  private calculateOptimalZoom(locations: PhoneLocation[]): number {
    if (locations.length <= 1) {
      return 15; // Close zoom for single location
    }

    // Calculate bounds and determine appropriate zoom level
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.latitude, lng: location.longitude });
    });

    // Rough zoom calculation based on bounds size
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latDiff = Math.abs(ne.lat() - sw.lat());
    const lngDiff = Math.abs(ne.lng() - sw.lng());
    const maxDiff = Math.max(latDiff, lngDiff);

    if (maxDiff > 10) return 4;
    if (maxDiff > 5) return 6;
    if (maxDiff > 2) return 8;
    if (maxDiff > 1) return 10;
    if (maxDiff > 0.5) return 12;
    return 14;
  }

  private centerMapOnMarkers(): void {
    if (!this.googleMap || this.phoneLocations.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    // Add all marker positions to bounds
    this.phoneLocations.forEach(location => {
      bounds.extend({ lat: location.latitude, lng: location.longitude });
    });

    // Fit the map to show all markers
    this.googleMap.fitBounds(bounds);

    // For single marker, set a reasonable zoom level
    if (this.phoneLocations.length === 1) {
      // Wait for fitBounds to complete, then set zoom
      setTimeout(() => {
        if (this.googleMap.googleMap) {
          this.googleMap.googleMap.setZoom(15);
        }
      }, 100);
    }
  }

  constructor (private locationService: LocationService) {}

  async ngOnInit () {
    this.loading.set(true);
    const data : PhoneNumbers = await this.locationService.getPhoneNumbers();
    this.phoneNumbers = data.phoneNumbers;
    this.loading.set(false);
  }

  async onSelectionChange (event: MatSelectChange) {
    this.phoneLocations.length = 0;

    console.log("Fetching location for phone number " + event.value);
    this.loading.set(true);

    try {
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

      // Update map center and zoom to show all markers
      if (this.phoneLocations.length > 0) {
        // Use setTimeout to ensure the map is rendered before fitting bounds
        setTimeout(() => {
          this.centerMapOnMarkers();
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching phone locations:', error);
    } finally {
      this.loading.set(false);
    }
  }

  showAddress(markerData: PhoneLocation, marker: MapAdvancedMarker) {
    // Set the selected marker data
    this.selectedMarkerData = markerData;

    // Center the map on the clicked marker
    if (this.googleMap && this.googleMap.googleMap) {
      this.googleMap.googleMap.panTo({
        lat: markerData.latitude,
        lng: markerData.longitude
      });
      // Optionally zoom in a bit
      const currentZoom = this.googleMap.googleMap.getZoom() || 10;
      if (currentZoom < 12) {
        this.googleMap.googleMap.setZoom(12);
      }
    }

    if (this.infoWindow) {
      // Open the info window anchored to the clicked marker
      this.infoWindow.open(marker);
      this.infoWindowVisible = true;
    }
  }

  // Method to reset map view to show all markers
  resetMapView(): void {
    this.centerMapOnMarkers();
  }

}
