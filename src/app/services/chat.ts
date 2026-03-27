import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Chat {

   
  constructor(private http: HttpClient) {}

  sendChecklist(items: any[]) {
    return this.http.post<{ reply: string }>('http://localhost:3000/api/chat', { items });
  }

}

