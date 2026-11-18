import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Toast } from './shared/components/toast/toast';
import { Footer } from './shared/components/footer/footer';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar,Toast,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 
}
