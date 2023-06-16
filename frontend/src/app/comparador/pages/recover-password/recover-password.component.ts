import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  emailHide: string = '';

  hidePassword = true;
  hideConfirmPassword = true;
  @ViewChild('stepper') private myStepper!: MatStepper;

  firstFormGroup: FormGroup = this._formBuilder.group({ email: [''] });
  secondFormGroup: FormGroup = this._formBuilder.group({ code: [''] });
  passwordFormGroup: FormGroup = this._formBuilder.group({ password: [''], confirmPassword: [''] }, { validator: this.checkPasswords });

  constructor(private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.secondFormGroup = this._formBuilder.group({
      code: ['', Validators.required]
    });

    this.passwordFormGroup = this._formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ notSame: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }
  }

  hideEmail() {
    const email = this.firstFormGroup.get('email')?.value.toLowerCase();
    const caracteresVisibles = email.substring(0, 3);
    const parteOculta = email.replace(/^.+(?=@)/, "*****");
    const emailOculto = caracteresVisibles + parteOculta;
    this.emailHide = emailOculto;

    this.authService.postRecoverPassword({ email: email }).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  submitPassword() {
    if (this.passwordFormGroup.valid) {
      const password = this.passwordFormGroup.get('password')?.value;
      const email = this.firstFormGroup.get('email')?.value.toLowerCase();

      this.authService.updatePassword(email, password).subscribe(
        res => {
          this.snackBar.open('Contraseña actualizada con éxito', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/comparador/login']);
        },
        err => {
          this.snackBar.open('Error al actualizar la contraseña', 'Cerrar', {
            duration: 3000,
          });
          this.myStepper.reset();
        }
      );
    }
  }

  validateRecoverCode() {
    const email = this.firstFormGroup.get('email')?.value.toLowerCase();
    const code = this.secondFormGroup.get('code')?.value;
  
    this.authService.verifyRecoverCode(email, code).pipe(take(1)).subscribe(
      res => {
        if (res.status === 'Token verified') { 
          this.myStepper.next();
        } 
      },
      err => {
        console.log(err);
        this.snackBar.open('El código de recuperación no es válido', 'Cerrar', {
          duration: 3000,
        });
        this.myStepper.reset();
      }
    );
  }
  
}
