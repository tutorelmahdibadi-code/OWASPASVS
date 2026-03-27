import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Chat } from '../services/chat';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.html',
  styleUrls: ['./solutions.css'],
})
export class Solutions implements OnInit {
  solutionText = signal<string>('');
  loading = signal<boolean>(false);
  selectedItems: any[] = [];

  constructor(private chat: Chat, private router: Router) {}

  ngOnInit() {
    // Example: populate selectedItems
    this.selectedItems = [
      { '#': '2.1.1', Area: 'Password Security', 'Verification Requirement': 'Verify user passwords are at least 12 characters' },
    ];
    if (this.selectedItems.length > 0) this.generateSolutions();
  }

  async generateSolutions() {
    this.loading.set(true);
    this.solutionText.set('');

    try {
      const response = await this.chat.sendChecklist(this.selectedItems).toPromise();
      this.solutionText.set(response?.reply || 'No response from AI');
    } catch (err) {
      console.error('Error calling AI service', err);
      this.solutionText.set('Error contacting AI service.');
    } finally {
      this.loading.set(false);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}