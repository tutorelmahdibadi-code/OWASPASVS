import { Component, Input, Signal, computed, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Solutions } from '../solutions/solutions';

import { Selection } from '../selection';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private http:HttpClient, private router:Router, private data: Selection, private route: ActivatedRoute){}

  //@Input() title!: Signal<string>

  // Store full JSON object
  items = signal<Record<string, any[]>>({});

  // Computed signal: list of top-level keys
  domains = computed(() => Object.keys(this.items()));

  title: string = '';
  
  ngOnInit() {
     
    this.title = this.route.snapshot.data['title'];

      this.http.get<Record<string, any[]>>('https://tutorelmahdibadi-code.github.io/elmahdibadi/asvs.json')
      .subscribe({
        next: data => {
          this.items.set(data); // ✅ store as-is, do NOT flatten
           console.log('Received in Analysis:', data); 
        },
        error: err => console.error('Failed to fetch JSON:', err)
      });
  }


  selected = signal<any[]>([])

 

  /*toggleItem(item: any, checked: boolean) {
  if (checked) {
    if (!this.selected().includes(item)) {
      this.selected().push(item);
    }
  } else if(!checked){
    this.selected.set(
    this.selected().filter(i => i['#'] !== item['#'])
    );
  }
  console.log('Current selected:', this.selected);
}*/
  


  
toggleItem(item: any, checked: boolean) {
  // Update local selection
  this.selected.update((current) => {
    if (checked) return [...current, item];
    return current.filter(i => i['#'] !== item['#']);
  });

  console.log('Updated local selected:', this.selected());
}

analyse() {
  const itemsToSend = this.selected();  // Get actual array from signal
  if (itemsToSend.length === 0) {
    alert('Please select at least one item!');
    return;
  }

  // ✅ Save selections in the service
  this.data.setSelections(itemsToSend);

  console.log('Selections saved in service:', this.data.getSelections());

  // Navigate after storing
  this.router.navigate(['/solutions']);
}
  resetSelections(){

    this.selected.set([]);           // Clear local selections signal
    this.data.setSelections([]);   

  }

// Pour stocker le terme de recherche
searchTerm = '';

// Pour filtrer le niveau sélectionné (par défaut 'all')
selectedLevel = 'all';

// Méthode pour filtrer items par domaine selon recherche + niveau ASVS
filteredItems(domain: string) {
  return this.items()[domain].filter(item => {
    const matchesSearch = this.searchTerm === '' ||
      item['Area'].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item['Verification Requirement'].toLowerCase().includes(this.searchTerm.toLowerCase());
    const matchesLevel = this.selectedLevel === 'all' || `L${item['ASVS Level']}` === this.selectedLevel;
    return matchesSearch && matchesLevel;
  });
}


}
