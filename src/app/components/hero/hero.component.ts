import { Component } from '@angular/core';


interface Review {
  id: number;
  avatar: string;
  name: string;
}

@Component({
    selector: 'app-hero',
    imports: [],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  reviews: Review[] = [
    { id: 1, avatar: '👨', name: 'User 1' },
    { id: 2, avatar: '👩', name: 'User 2' },
    { id: 3, avatar: '👨', name: 'User 3' },
    { id: 4, avatar: '👩', name: 'User 4' }
  ];

  rating: number = 4.9;
  reviewCount: number = 450;
  stars: number[] = [1, 2, 3, 4, 5];

  onBrowseCollection(): void {
    console.log('Browse collection clicked');
  }

  onHowItWorks(): void {
    console.log('How it works clicked');
  }
}
