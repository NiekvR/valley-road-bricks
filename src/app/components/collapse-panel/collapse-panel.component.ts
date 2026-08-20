import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-collapse-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './collapse-panel.component.html',
    styleUrl: './collapse-panel.component.scss'
})
export class CollapsePanelComponent {
    /** Titel van het paneel */
    @Input() title = 'Paneel';

    /** Start het paneel open of dicht */
    @Input() initiallyOpen = false;

    /** Optioneel icoon links van de titel */
    @Input() icon: string | null = null;

    isOpen = signal(false);

    ngOnInit() {
        this.isOpen.set(this.initiallyOpen);
    }

    toggle() {
        this.isOpen.update(v => !v);
    }
}
