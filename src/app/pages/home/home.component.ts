import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/tasks.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  })

  tasks = signal<Task[]>([])
  filter = signal<'all' | 'pending' | 'completed'>('all')
  taskByFilter = computed(() => {
    const filter = this.filter()
    const tasks = this.tasks()
    if(filter === 'pending'){
      return tasks.filter(task => !task.completed)
    }
    if(filter === 'completed'){
      return tasks.filter(task => task.completed)
    }
    return tasks
  })

  injector = inject(Injector)

  ngOnInit(){
    const storage = localStorage.getItem('tasks')
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks)
    }
    this.trackTasks()
  }

  trackTasks(){
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }, {injector: this.injector})
  }

  addTask(title:string){
    const newTasks = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTasks])
  }

  changeHandler(){
    if(this.newTaskCtrl.valid && this.newTaskCtrl.value.trim() != ''){
      const value = this.newTaskCtrl.value.trim()
      this.addTask(value)
      this.newTaskCtrl.setValue('')
    }
  }

  deleteTask(id: number){
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id))
  }

  completedTask(id:number){
    this.tasks.update((tasks) => tasks.map((task) => {
      if(task.id == id){
        return {
          ...task,
          completed: !task.completed
        }
      }
      return task
    }))
  }

  updateTaskEditingMode(id:number){
    this.tasks.update((tasks) => tasks.map((task, position) => {
      if(task.id == position){
        return {
          ...task,
          editing: true
        }
      }
      return {
        ...task,
        editing: false
      }
    }))
  }

  updateTaskText(id:number, event: Event){
    const input = event.target as HTMLInputElement
    this.tasks.update(prevState => {
      return prevState.map((task)=>{
        if(task.id === id){
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task
      })
    })
  }

  changeFilter(filter:'all' | 'pending' | 'completed'){
    this.filter.set(filter)
  }

  deleteCompleteTasks(){
    this.tasks.update((tasks) => tasks.filter((task) => task.completed != true))
  }
}
