import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shared.home.routed',
  templateUrl: './shared.home.routed.component.html',
  styleUrls: ['./shared.home.routed.component.css'],
  standalone: true, // ✅ Esto es clave para componentes standalone
  imports: [
    TranslateModule
  ]
})
export class SharedHomeRoutedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
