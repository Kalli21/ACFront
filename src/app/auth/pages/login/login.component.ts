import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/predict_sentiment/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private service: UsuarioService,
    private router: Router) {
    this.loginForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.required]
      });
   }


  login(): void {
    if (this.loginForm.valid) {
      
      this.service.login(this.loginForm.value).subscribe((data: any) =>{
       localStorage.setItem( 'userName', data.result.userName);
       localStorage.setItem('token_value', data.result.token);
       localStorage.setItem('userInfo', data.result);
       alert(data.displayMessage);
       this.router.navigate(['/analisis'])
      })
  
      }
  }
}
