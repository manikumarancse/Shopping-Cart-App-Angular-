import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable();
  // message:string="";
  constructor() { }

  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
  }
  // setMessage(data:string){
  //   this.message=data;
  // }
  getmessage() {
    return this.searchTerm.value;
  }
}
