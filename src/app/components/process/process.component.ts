import { Component } from '@angular/core';


interface ProcessStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}

@Component({
    selector: 'app-process',
    imports: [],
    templateUrl: './process.component.html',
    styleUrls: ['./process.component.scss']
})
export class ProcessComponent {
  steps: ProcessStep[] = [
    {
      number: 1,
      icon: 'assets/icons/Choose.svg',
      title: 'Kies een set',
      description: 'Kies jouw favorite LEGO®-set.'
    },
    {
      number: 2,
      icon: 'assets/icons/Rent.svg',
      title: 'Maak een afspraak',
      description: 'We controleren en verpakken jouw set veilig, zodat alle stukjes aanwezig zijn.'
    },
    {
      number: 3,
      icon: 'assets/icons/Play.svg',
      title: 'Bouw & geniet',
      description: 'Bouw en geniet van uren bouwplezier bij jou thuis.'
    },
    {
      number: 4,
      icon: 'assets/icons/Return.svg',
      title: 'Retourneer gratis',
      description: 'Maak een afspraak om de set weer in te leveren.'
    },
    {
      number: 5,
      icon: 'assets/icons/Repeat.svg',
      title: 'Kies je volgende avontuur',
      description: 'Klaar? Kies je volgende set en begin opnieuw!'
    }
  ];
}
