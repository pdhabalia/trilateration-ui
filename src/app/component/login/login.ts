import { Component } from '@angular/core'
import { AuthenticationService } from '../../service/authentication.service'
import { Router } from '@angular/router'
import { User } from '../../model/user.model'
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatOptionModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatError, MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isLoginValid: boolean = true
  hidePassword: boolean = true
  isLoading: boolean = false

  form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required
    ]),
    password: new FormControl<string | null>(null, [Validators.required])
  })

  constructor (
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  async onLogin () {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true
      this.isLoginValid = true

      let username = this.form.get('username')?.value
      let password = this.form.get('password')?.value

      username = username == null ? '' : username.trim()
      password = password == null ? '' : password

      try {
        await this.authenticationService.login(username, password)
        this.router.navigate(['/history'])
      } catch(error) {
        console.error('Login error:', error)
        this.isLoginValid = false
      } finally {
        this.isLoading = false
      }
    }
  }
}
