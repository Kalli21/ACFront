import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMenuFixed = false;
  isLoading = true;
 
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    });
   }

  shouldShowMenu(): boolean {
    return !this.router.url.startsWith('/auth');
  }
  toggleMenu() {
    this.isMenuFixed = !this.isMenuFixed;
  }  
}
