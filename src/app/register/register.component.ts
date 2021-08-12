import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RegisterUser } from '../RegisterUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerUser: RegisterUser = {
    userName: '',
    password: '',
    password2: '',
  };
  public warning!: any;
  public success: boolean = false;
  public loading: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.registerUser = new RegisterUser();
  }

  onSubmit(f: NgForm): void {
    if (f.value.userName !== '' && f.value.password === f.value.password2) {
      this.loading = true;
      this.auth.register(this.registerUser).subscribe(
        (register) => {
          this.success = true;
          this.warning = null;
          this.loading = false;
        },
        (err) => {
          this.warning = err.error.message;
          this.success = false;
          this.loading = false;
        }
      );
    } else if (f.value.password !== f.value.password2) {
      this.warning = 'Passwords do not match';
      this.success = false;
      this.loading = false;
    }
  }
}
