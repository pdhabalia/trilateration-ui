import { enableProdMode, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface EnvironmentConfiguration {
  env: string
  apiBaseUrl: string
  password: string
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentConfigurationService {
  private env: EnvironmentConfiguration = {
    env: 'local',
    apiBaseUrl: '',
    password: '',
    email: ''
  }

  constructor (private http: HttpClient) {}

  public get configuration () {
    return this.env
  }

  loadConfiguration (): Observable<EnvironmentConfiguration> {
    // this.http.get<EnvironmentConfiguration>('config/app-settings.json', {
    //   headers: {
    //     'Cache-Control' : 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    //     Pragma: 'no-cache',
    //     Expires: '0'
    //   }
    // });

    const envConfig = this.http.get<EnvironmentConfiguration>(
      'config/app-settings.json'
    )
    console.log('Environment ' + this.env)

    if (this.env.env === 'PROD') {
      enableProdMode()
    }
    return envConfig;
  }
}
