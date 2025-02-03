import { Routes } from '@angular/router';
import { SocioAdminPlistRoutedComponent } from './component/socio/socio.admin.plist.routed/socio.admin.plist.routed.component';
import { InstalacionAdminPlistRoutedComponent } from './component/instalacion/instalacion.admin.plist.routed/instalacion.admin.plist.routed.component';
import { InmuebleAdminPlistRoutedComponent } from './component/inmueble/inmueble.admin.plist.routed/inmueble.admin.plist.routed.component';
import { SocioAdminDeleteRoutedComponent } from './component/socio/socio.admin.delete.routed/socio.admin.delete.routed.component';
import { SocioAdminEditRoutedComponent } from './component/socio/socio.admin.edit.routed/socio.admin.edit.routed.component';
import { SocioAdminCreateRoutedComponent } from './component/socio/socio.admin.create.routed/socio.admin.create.routed.component';
import { SocioAdminViewRoutedComponent } from './component/socio/socio.admin.view.routed/socio.admin.view.routed.component';
import { InmuebleAdminDeleteRoutedComponent } from './component/inmueble/inmueble.admin.delete.routed/inmueble.admin.delete.routed.component';
import { InmuebleAdminEditRoutedComponent } from './component/inmueble/inmueble.admin.edit.routed/inmueble.admin.edit.routed.component';
import { InmuebleAdminCreateRoutedComponent } from './component/inmueble/inmueble.admin.create.routed/inmueble.admin.create.routed.component';
import { InmuebleAdminViewRoutedComponent } from './component/inmueble/inmueble.admin.view.routed/inmueble.admin.view.routed.component';
import { InstalacionAdminDeleteRoutedComponent } from './component/instalacion/instalacion.admin.delete.routed/instalacion.admin.delete.routed.component';
import { InstalacionAdminEditRoutedComponent } from './component/instalacion/instalacion.admin.edit.routed/instalacion.admin.edit.routed.component';
import { InstalacionAdminCreateRoutedComponent } from './component/instalacion/instalacion.admin.create.routed/instalacion.admin.create.routed.component';
import { InstalacionAdminViewRoutedComponent } from './component/instalacion/instalacion.admin.view.routed/instalacion.admin.view.routed.component';

export const routes: Routes = [


  { path: 'admin/socio/plist', component: SocioAdminPlistRoutedComponent },
  { path: 'admin/socio/delete/:id', component: SocioAdminDeleteRoutedComponent },
  { path: 'admin/socio/edit/:id', component: SocioAdminEditRoutedComponent },
  { path: 'admin/socio/create', component: SocioAdminCreateRoutedComponent },
  { path: 'admin/socio/view/:id', component: SocioAdminViewRoutedComponent},

 
  {path: 'admin/inmueble/plist', component:InmuebleAdminPlistRoutedComponent},
  {path: 'admin/inmueble/delete/:id', component:InmuebleAdminDeleteRoutedComponent},
  {path: 'admin/inmueble/edit/:id', component:InmuebleAdminEditRoutedComponent},
  {path: 'admin/inmueble/create', component:InmuebleAdminCreateRoutedComponent},
  {path: 'admin/inmueble/view/:id', component:InmuebleAdminViewRoutedComponent},
  


  { path: 'admin/instalacion/plist', component: InstalacionAdminPlistRoutedComponent },
  {path: 'admin/instalacion/delete/:id', component: InstalacionAdminDeleteRoutedComponent},
  {path: 'admin/instalacion/edit/:id', component: InstalacionAdminEditRoutedComponent},
  {path: 'admin/instalacion/create', component: InstalacionAdminCreateRoutedComponent},
  {path: 'admin/instalacion/view/:id', component: InstalacionAdminViewRoutedComponent},
  //{ path: 'admin/instalacion/plist/xtipocuenta/:id', component : InmuebleXsocioAdminPlistRoutedComponent},
];
