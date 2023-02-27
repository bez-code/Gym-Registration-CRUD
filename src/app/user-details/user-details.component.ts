import { Component, OnInit } from '@angular/core';
import { User } from '../models/user/user.models';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public userId!: number;
  public userDetail!: User;


  constructor(
    private activateRoute: ActivatedRoute,
    private api: ApiService,

  ) {

  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe(val => {
      this.userId = val['id'];
      this.fetchUserDetails(this.userId)
    })
  }
  fetchUserDetails(userId : number) {
    this.api.getRegisteredUserID(userId).subscribe(res => {
      if (Array.isArray(res)) {
        // If the result is an array, assume that the first element is the user details
        this.userDetail = res[0];
        console.log(this.userDetail);
      } else {
        // Otherwise, assume that the result is a single user object
        this.userDetail = res;
        console.log(this.userDetail);
      }
    });
  }
}
