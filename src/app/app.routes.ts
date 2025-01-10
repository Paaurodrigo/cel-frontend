import { Routes } from '@angular/router';
import { SocioAdminPlistRoutedComponent } from './component/socio/socio.admin.plist.routed/socio.admin.plist.routed.component';
import { InstalacionAdminPlistRoutedComponent } from './component/instalacion/instalacion.admin.plist.routed/instalacion.admin.plist.routed.component';
import { InmuebleAdminPlistRoutedComponent } from './component/inmueble/inmueble.admin.plist.routed/inmueble.admin.plist.routed.component';
import { SocioAdminDeleteRoutedComponent } from './component/socio/socio.admin.delete.routed/socio.admin.delete.routed.component';
import { SocioAdminEditRoutedComponent } from './component/socio/socio.admin.edit.routed/socio.admin.edit.routed.component';
import { SocioAdminCreateRoutedComponent } from './component/socio/socio.admin.create.routed/socio.admin.create.routed.component';
import { SocioAdminViewRoutedComponent } from './component/socio/socio.admin.view.routed/socio.admin.view.routed.component';

export const routes: Routes = [


  { path: 'admin/socio/plist', component: SocioAdminPlistRoutedComponent },
  { path: 'admin/socio/delete/:id', component: SocioAdminDeleteRoutedComponent },
  { path: 'admin/socio/edit/:id', component: SocioAdminEditRoutedComponent },
  { path: 'admin/socio/create', component: SocioAdminCreateRoutedComponent },
  { path: 'admin/socio/view/:id', component: SocioAdminViewRoutedComponent},

  { path: 'admin/instalacion/plist', component: InstalacionAdminPlistRoutedComponent },
  {path: 'admin/inmueble/plist', component:InmuebleAdminPlistRoutedComponent},
];
