import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SignUpResponse } from '../../responses/user/signup-response';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  verified: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    debugger;
    this.verifyEmail(token!);
  }

  verifyEmail(token: string) {
    debugger;
    this.userService.verifyEmail(token).subscribe({
      next: (response: SignUpResponse) => {
        debugger;
        this.verified = true;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  resend() {
    location.reload();
  }
}
