import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss'
})
export class LabsComponent {

  welcome: string = 'Bienvenido'
  name = signal('Julian')
  age:number = 18
  urlImg:string = 'https://w3schools.com/howto/img_avatar.png'
  disabled:boolean = true
  tasks = signal([
    'Crear servicio',
    'Realiazr curso',
    'Optimizar tiempo'
  ])
  person = signal({
    name: 'Julian',
    age: 18,
    avatar:'https://w3schools.com/howto/img_avatar.png'
  })
  colorCtrl = new FormControl()
  widthCtrl = new FormControl(50, {
    nonNullable: true
  })
  nombreCtrl = new FormControl(null, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })

  ngOnInit(){
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  clickHandler(){
    alert('Hola')
  }

  changeHandler(event: Event){
    const input = event.target as HTMLInputElement
    const newValue = input.value
    this.name.set(newValue)
  }

  keyDownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement
    console.log(input.value);
  }

  changeAge(event: Event){
    const input = event.target as HTMLInputElement
    const newValue = input.value
    //Si quiero cambiar el valor
    this.person.update(prevState => {
      return{
        ...prevState,
        age: parseInt(newValue)
      }
    })
  }

  changeName(event: Event){
    const input = event.target as HTMLInputElement
    const newValue = input.value
    //Si quiero cambiar el valor
    this.person.update(prevState => {
      return{
        ...prevState,
        name: newValue
      }
    })
  }
}
