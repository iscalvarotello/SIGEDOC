import { Component, input } from '@angular/core';

@Component({
  selector: 'app-document',
  imports: [],
  templateUrl: './document.component.html',
})
export class DocumentComponent { 
  tipo_documento = input<number>( 1 );
}
