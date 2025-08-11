import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CellInfo, LocationResponse, PhoneLocation } from '../model/cell-location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  
  private apiUrl = 'http://localhost:8081/imei'; // your backend URL
  
  private httpOptions: any;
  
  constructor(private http: HttpClient) {
    this.httpOptions = {
      observe: 'body', 
      responseType: 'json',
      /*
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*'
      })
      */
      headers:{'Access-Control-Allow-Origin':'*'}
    };
  }

  getLiveLocation(cellInfo: CellInfo): Observable<PhoneLocation> {
    const url = `${this.apiUrl}/live-location`;
    return this.http.post<PhoneLocation>(url, cellInfo);
  }

  getPhoneLocation(phoneNumber : string) : Observable<PhoneLocation[]>{
    const url = `${this.apiUrl}/locations/${phoneNumber}`;
    return this.http.get<PhoneLocation[]>(url);
  }

  getPhoneNumbers() : Observable<string[]>{
    const url = `${this.apiUrl}/phones`;
    return this.http.get<string[]>(url);
  }
}
