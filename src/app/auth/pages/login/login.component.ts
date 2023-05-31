import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.required]
      });
   }


  login(): void {
    if (this.loginForm.valid) {
      const userName = this.loginForm.value.userName;
      const password = this.loginForm.value.password;

      // Aquí puedes agregar la lógica de inicio de sesión
      console.log('Usuario:', userName);
      console.log('Contraseña:', password);
    }
  }
}
