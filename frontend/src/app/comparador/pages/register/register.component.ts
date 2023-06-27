import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationSuccessRegisterComponent } from '../../notifications/notification-success-register/notification-success-register.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NotificationErrorRegisterComponent } from '../../notifications/notification-error-register/notification-error-register.component';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  hidePassword = true;
  hideConfirmPassword = true;
  @ViewChild('stepper') private myStepper!: MatStepper;

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordFormGroup = this._formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  register(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.passwordFormGroup.valid) {
      const name = this.firstFormGroup.get('name')?.value;
      const email = this.secondFormGroup.get('email')?.value.toLowerCase();
      const password = this.passwordFormGroup.get('password')?.value;
      const user = { name, email, password };

      this.subscription.add(
        this.authService.register(user).subscribe({
          next: (response) => {
            this.openSnackBarSucess();
            this.router.navigate(['/comparador/login']);
          },
          error: (error) => {
            this.openSnackBarError(error.message);
            console.log("Hubo un error al registrar al usuario", error);
            this.myStepper.reset();
            this.firstFormGroup.reset();
            this.secondFormGroup.reset();
            this.passwordFormGroup.reset();
          }
        })
      );
    }
  }

  openSnackBarSucess() {
    this.snackBar.openFromComponent(NotificationSuccessRegisterComponent, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  openSnackBarError(errorMessage: string) {
    this.snackBar.openFromComponent(NotificationErrorRegisterComponent, {
      data: { message: errorMessage },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
