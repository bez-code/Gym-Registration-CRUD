import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {
  public genders: string[] = ["Male", 'Female'];
  public packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  public importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healtier Digestive System',
    'Sugar Craving Body',
    'Fitness'
  ];
  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActivate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private api: ApiService,
    private toastService: NgToastService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],

    })

    this.registerForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
    })

    this.activateRoute.params.subscribe(val => {
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserID(this.userIdToUpdate).subscribe(res => {
        this.isUpdateActivate = true;
        this.updatedForm(res);
      })
    })
  }

  submit() {
    this.api.postRegistration(this.registerForm.value).subscribe(res => {
      this.toastService.success({ detail: "Succes", summary: "Enquiry Adedd", duration: 3000 });
      this.registerForm.reset();
    })
  }

  update() {
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate).subscribe(res => {
      this.toastService.success({ detail: "Succes", summary: "Enquiry Updated", duration: 3000 });
      this.registerForm.reset();
      this.router.navigate(['list'])
    })
  }

  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * height)
    this.registerForm.controls["bmi"].patchValue(bmi);

    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue("Normal");
        break;
      case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
        break;


      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");
        break;
    }

  }

  updatedForm(user: any) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate,
    })
  }
}

