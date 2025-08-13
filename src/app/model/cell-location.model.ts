export interface CellInfo {
  mcc: number
  mnc: number
  lac: number
  cid: number
}

export interface LocationResponse {
  lat: number
  lng: number
}

export interface CellPhoneInfo {
  phoneNumber: string
  mcc: number
  mnc: number
  lac: number
  cid: number
}

export interface PhoneLocation {
  phoneNumber: string
  mcc: number
  mnc: number
  lac: number
  cid: number
  latitude: number
  longitude: number
  locationDateTime: Date
  address: string
}

export interface PhoneNumbers {
  phoneNumbers: string[];
}
