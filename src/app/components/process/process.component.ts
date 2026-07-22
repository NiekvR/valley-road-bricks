import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProcessStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent {
  steps: ProcessStep[] = [
    {
      number: 1,
      icon: '👆',
      title: 'Kies een set',
      description: 'Kies jouw favorite LEGO®-set en selecteer de huurgeldode.'
    },
    {
      number: 2,
      icon: '📦',
      title: 'Wij verzenden',
      description: 'We verpakken jouw set veilig en verzenden deze znel naar je toe.'
    },
    {
      number: 3,
      icon: '🧱',
      title: 'Bouw & geniet',
      description: 'Bouw, geniet en beloof umring bouwerij bij jou thuis.'
    },
    {
      number: 4,
      icon: '↩️',
      title: 'Retourneer gratis',
      description: 'Gebruik het meegeleverde retourlabel en stuur de set terug.'
    },
    {
      number: 5,
      icon: '🎉',
      title: 'Kies je volgende avontuur',
      description: 'Klaar? Kies je volgende set en begin opnieuw!'
    }
  ];
}
