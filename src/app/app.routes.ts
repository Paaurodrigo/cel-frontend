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
import { InmuebleXsocioAdminPlistRoutedComponent } from './component/inmueble/inmueble.xsocio.admin.plist.routed/inmueble.xsocio.admin.plist.routed.component';
import { SharedLoginRoutedComponent } from './shared/shared.login.routed/shared.login.routed';
import { SharedLogoutRoutedComponent } from './shared/shared.logout.routed/shared.logout.routed';
import { SharedHomeRoutedComponent } from './shared/shared.home.routed/shared.home.routed.component';
import { AdminGuard } from './guards/admin.guard';
import { SharedByemailRoutedComponent } from './shared/shared.byemail.routed/shared.byemail.routed.component';
import { MiembroGuard } from './guards/miembro.guard';
import { SharedRegistrerRoutedComponent } from './shared/shared.registrer.routed/shared.registrer.routed.component';
import { InmuebleXinstalacionAdminPlistRoutedComponent } from './component/inmueble/inmueble.xinstalacion.admin.plist.routed/inmueble.xinstalacion.admin.plist.routed.component';

export const routes: Routes = [

  { path: 'login', component: SharedLoginRoutedComponent },
  { path: 'logout', component: SharedLogoutRoutedComponent },
  { path: '', component: SharedHomeRoutedComponent },
  { path: 'byemail/:email', component: SharedByemailRoutedComponent},
  { path: 'register', component: SharedRegistrerRoutedComponent },
  
  
  
  
  { path: 'admin/socio/plist', component: SocioAdminPlistRoutedComponent,canActivate: [AdminGuard] },
  { path: 'admin/socio/delete/:id', component: SocioAdminDeleteRoutedComponent,canActivate: [AdminGuard] },
  { path: 'admin/socio/edit/:id', component: SocioAdminEditRoutedComponent,canActivate: [AdminGuard] },
  { path: 'admin/socio/create', component: SocioAdminCreateRoutedComponent,canActivate: [AdminGuard] },
  { path: 'admin/socio/view/:id', component: SocioAdminViewRoutedComponent,canActivate: [AdminGuard]},

  
  {path: 'admin/inmueble/plist', component:InmuebleAdminPlistRoutedComponent,canActivate: [AdminGuard] },
  {path: 'admin/inmueble/delete/:id', component:InmuebleAdminDeleteRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/edit/:id', component:InmuebleAdminEditRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/create', component:InmuebleAdminCreateRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/view/:id', component:InmuebleAdminViewRoutedComponent,canActivate: [AdminGuard]},
  


  { path: 'admin/instalacion/plist', component: InstalacionAdminPlistRoutedComponent,canActivate: [AdminGuard] },
  {path: 'admin/instalacion/delete/:id', component: InstalacionAdminDeleteRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/instalacion/edit/:id', component: InstalacionAdminEditRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/instalacion/create', component: InstalacionAdminCreateRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/instalacion/view/:id', component: InstalacionAdminViewRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/plist/xsocio/:id', component :InmuebleXsocioAdminPlistRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/plist/xinstalacion/:id', component :InmuebleXinstalacionAdminPlistRoutedComponent,canActivate: [AdminGuard]}
];
