import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Header } from "./component/header/header";
import { Footer } from "./component/footer/footer";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Navbar } from "./component/navbar/navbar";
import { Location } from "./component/location/location";
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    Header,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    Footer,
    Navbar,
    Location
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('trilateration-ui');
}
