import { Component } from '@angular/core';

@Component({
  selector: 'app-tol-tips',
  templateUrl: './tol-tips.component.html',
  styleUrls: ['./tol-tips.component.css']
})
export class TolTipsComponent {
  isCollapsed: boolean = false;

  toggleCard() {
    this.isCollapsed = !this.isCollapsed;
  }
}
