import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/predict_sentiment/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private service: UsuarioService,
    private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  login(): void {
    if (this.loginForm.valid) {

      this.service.login(this.loginForm.value).subscribe((data: any) => {        
        localStorage.setItem('primerInicio','true');
        localStorage.setItem('userName', data.result.userName);
        localStorage.setItem('token_value', data.result.token);
        const objStr = JSON.stringify(data.result);
        localStorage.setItem('userInfo', objStr);
        this.showMessage("Sesión Exitosa")
        this.router.navigate(['/analisis'])
        this.service.getEstado();
      })

    }
  }

  showMessage(mng: string) {
    this.snackBar.open(mng, '', {
      duration: 5000, // 5 segundos
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['transparent-snackbar']
    });
  }

}
