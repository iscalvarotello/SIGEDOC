import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '@metasystem/shell/auth-page-layout/auth-page-layout.component';
import { SignupFormComponent } from '../components/signup-form/signup-form.component';

@Component({
  selector: 'app-sign-up',
  imports: [
    AuthPageLayoutComponent,
    SignupFormComponent],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export class SignUpComponent {

}
