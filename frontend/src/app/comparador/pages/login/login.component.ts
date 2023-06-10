import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup = this._formBuilder.group({ email: [''], password: [''] })
  public loginValid = true;

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
      this.authService.login(this.loginFormGroup.value).subscribe(
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
