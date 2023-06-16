import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup = this._formBuilder.group({ email: [''], password: [''] })
  public loginValid = true;
  hide: boolean = true;

  constructor(private _formBuilder: FormBuilder,
              private authService: AuthService, 
              private router: Router) { }

  ngOnInit(): void {
    this.loginFormGroup = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.loginFormGroup.valid) {
      const user: User = {
        "email": this.loginFormGroup.get('email')?.value.toLowerCase(),
        "password": this.loginFormGroup.get('password')?.value.toLowerCase(),
        "name": ''
      }
    
      this.authService.login(user).subscribe(
        res => {
          this.router.navigate(['/comparador/featured-products']);
        },
        err => {
          this.loginValid = false;
          console.log(err);
        }
      );
    }
  }
}
