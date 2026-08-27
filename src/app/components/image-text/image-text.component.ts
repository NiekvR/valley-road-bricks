import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-image-text',
  imports: [CommonModule],
  templateUrl: './image-text.component.html',
  styleUrl: './image-text.component.scss',
})
export class ImageTextComponent {
    @Input() image = '';
    @Input() text = '';
    @Input() imageSide: 'left' | 'right' = 'left';
    @Input() mobileImages: boolean = false;
}
