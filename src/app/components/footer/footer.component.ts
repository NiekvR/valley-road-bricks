import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";


interface FooterLink {
  label: string;
  link: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
    selector: 'app-footer',
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  sections: FooterSection[] = [
    {
      title: 'Klantenservice',
      links: [
        { label: 'FAQ', link: 'faq' },
        { label: 'Contact', link: 'contact' }
      ]
    },
    {
      title: 'Informatie',
      links: [
        { label: 'Hoe werkt huren?', link: 'hoe-het-werkt' },
        { label: 'Over ons', link: 'over-ons' },
        // { label: 'Blog', link: '#' },
        // { label: 'Duurzaamheid', link: '#' }
      ]
    },
    // {
    //   title: 'Mijn account',
    //   links: [
    //     { label: 'Inloggen', link: '#' },
    //     { label: 'Mijn verhuur', link: '#' },
    //     { label: 'Favorieten', link: '#' },
    //     { label: 'Retourannulering', link: '#' }
    //   ]
    // }
  ];
}
