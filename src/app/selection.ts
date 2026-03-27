import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Selection {

  selections = signal<any[]>([]);

  setSelections(selections: any[]) {
    this.selections.set(selections);
  }

  getSelections(): any[] {
    return this.selections();
  }
  
}
