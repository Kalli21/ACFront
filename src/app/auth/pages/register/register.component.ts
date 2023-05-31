import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/predict_sentiment/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private service: UsuarioService,
              private router: Router) {
    this.registerForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])]
      });
   }


  register(): void {
    if (this.registerForm.valid) {
      const userName = this.registerForm.value.userName;
      const password = this.registerForm.value.password;
      
    this.service.register(this.registerForm.value).subscribe((data: any) =>{
     localStorage.setItem( 'userName', data.result.userName);
     localStorage.setItem('token_value', data.result.token);
     alert(data.displayMessage);
     this.router.navigate(['/analisis'])
    })


      // Aquí puedes agregar la lógica de inicio de sesión
      console.log('Usuario:', userName);
      console.log('Contraseña:', password);
    }
  }
}
