import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { PhoneLocation, PhoneNumbers } from '../model/cell-location.model'
import { firstValueFrom } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  
  private apiUrl : string |undefined;
  
  constructor (private http: HttpClient) {
    this.apiUrl = environment.apiBaseUrl;
    console.log("API URL : " + this.apiUrl);
  }

  async getLiveLocation (cellInfo: PhoneLocation): Promise<PhoneLocation> {
    const url = `${this.apiUrl}/phone-location`;
    try {
      return await firstValueFrom(
        this.http.post<PhoneLocation>(url, cellInfo)
      );
    } catch (error) {
      console.log(
        'Error fetching live location for ' + cellInfo.phoneNumber,
        error
      );
      throw error;
    }
  }

  async getPhoneLocation (phoneNumber: string): Promise<PhoneLocation[]> {
    const url = `${this.apiUrl}/locations/${phoneNumber}`;
    try {
      return await firstValueFrom(this.http.get<PhoneLocation[]>(url));
    } catch (error) {
      console.log(
        'Could not retrieve phone location for number ' + phoneNumber,
        error
      );
      throw error;
    }
  }

  async getPhoneNumbers (): Promise<PhoneNumbers> {
    const url = `${this.apiUrl}/phoneNumbers`;
    console.log("URL " , url);
    try {
      return await firstValueFrom(this.http.get<PhoneNumbers>(url));
    } catch (error) {
      console.log('Could not fetch the phone numbers', error);
      throw error;
    }
  }
}
