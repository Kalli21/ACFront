import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UsuarioService } from '../../../auth/services/predict_sentiment/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{
  isMenuFixed = false;
  isLoading = true;
  userName = localStorage.getItem('userName') || '';
  msgEstado = '';

  constructor(private router: Router,
    private usuarioService: UsuarioService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    });

    this.usuarioService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isMenuFixed = isLoggedIn;
      this.shouldShowMenu()
    });

    this.userName = localStorage.getItem('userName') || '';
    this.usuarioService.msgEstado$.subscribe((data: any) => {
      this.msgEstado = data;
    });
   }


  shouldShowMenu(): boolean {
    return this.usuarioService.isLoggedIn$  && !this.router.url.startsWith('/auth');
  }
  toggleMenu() {
    this.isMenuFixed = !this.isMenuFixed;
    this.userName = localStorage.getItem('userName') || '';
  }
  
  onLogout(){
    this.usuarioService.logout()
  }

}
