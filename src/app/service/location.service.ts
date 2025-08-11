import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { CellInfo, PhoneLocation } from '../model/cell-location.model'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:8081/imei' // your backend URL

  private httpOptions: any

  constructor (private http: HttpClient) {}

  async getLiveLocation (cellInfo: PhoneLocation): Promise<PhoneLocation> {
    const url = `${this.apiUrl}/live-location`;
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

  async getPhoneNumbers (): Promise<string[]> {
    const url = `${this.apiUrl}/phones`;
    try {
      return await firstValueFrom(this.http.get<string[]>(url));
    } catch (error) {
      console.log('Could not fetch the phone numbers', error);
      throw error;
    }
  }
}
