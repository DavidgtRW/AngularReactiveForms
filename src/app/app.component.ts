import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        //Angular will call the validator when check the validity, therefore, It will not
        //refer to this class, wherefore, I use the binding. 
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      })  ,
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );
    this.signupForm.statusChanges.subscribe(
      (value) => console.log(value)
    );
    this.signupForm.setValue({
      'userData':{
        'username' : 'David',
        'email' : 'david@test.com'
      },
      'gender' : 'male',
      'hobbies' : []
    });

    this.signupForm.patchValue({
      'userData':{
        'username' : 'Andres',
      },
    });
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control)
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  // In the template, you can then use:
  // *ngFor="let hobbyControl of getControls(); let i = index"

  //Alternatively, you can set up a getter and use an alternative type casting syntax:
  // get controls() {
  //   return (this.signupForm.get('hobbies') as FormArray).controls;
  // }

  // And then in the template:
  // *ngFor="let hobbyControl of controls; let i = index"

  forbiddenNames(control: FormControl): {[s: string]:boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden':true}
    }
    return null; //Should not pass {'nameIsForbidden':false}
    //Return null is the way to tell to Angular that the FormControl is valid
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden' : true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }
}
