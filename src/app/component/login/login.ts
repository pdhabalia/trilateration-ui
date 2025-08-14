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
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatError,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isLoginValid: boolean = true

  form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required//,
     // Validators.email
    ]),
    password: new FormControl<string | null>(null, [Validators.required])
  })

  constructor (
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  async onLogin () {
    if (this.form.valid) {
      //const username = this.form.get('username')?.value;
      let username = this.form.get('username')?.value ;
      let password = this.form.get('password')?.value;

      username = username == null ? '' : username;
      password = password == null ? '' : password;
      const user: User = await this.authenticationService.login(username, password);

      this.authenticationService.setToken(user.token)
      this.router.navigate(['/history'])
    }
  }
}
