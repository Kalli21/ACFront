import { Component } from '@angular/core';

@Component({
  selector: 'app-tol-tips',
  templateUrl: './tol-tips.component.html',
  styleUrls: ['./tol-tips.component.css']
})
export class TolTipsComponent {
  isCollapsed: boolean = false;

  ngOnInit() {
    // Leer el estado guardado de localStorage
    const savedState = localStorage.getItem('isCollapsed');
    this.isCollapsed = savedState === 'true'; // Convertir string a boolean
  }

  toggleCard() {
    this.isCollapsed = !this.isCollapsed;
    // Guardar el estado actualizado en localStorage
    localStorage.setItem('isCollapsed', String(this.isCollapsed));
  }
}
