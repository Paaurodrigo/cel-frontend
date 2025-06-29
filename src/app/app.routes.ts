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
import { InmuebleClientCreateRoutedComponent } from './component/inmueble/inmueble.client.create.routed/inmueble.client.create.routed.component';
import { InmuebleClientPlistRoutedComponent } from './component/inmueble/inmueble.client.plist.routed/inmueble.client.plist.routed.component';
import { InmuebleClientViewRoutedComponent } from './component/inmueble/inmueble.client.view.routed/inmueble.client.view.routed.component';
import { ConexionAdminCreateRoutedComponent } from './component/conexion/conexion.admin.create.routed/conexion.admin.create.routed.component';
import { ConexionAdminPlistRoutedComponent } from './component/conexion/conexion.admin.plist.routed/conexion.admin.plist.routed.component';
import { ConexionAdminDeleteRoutedComponent } from './component/conexion/conexion.admin.delete.routed/conexion.admin.delete.routed.component';
import { ConexionAdminViewRoutedComponent } from './component/conexion/conexion.admin.view.routed/conexion.admin.view.routed.component';
import { ConexionByInstalacionAdminPlistRoutedComponent } from './component/conexion/conexion.byinstalacion.admin.plist.routed/conexion.byintalacion.admin.plist.routed.component';
import { ConexionAdminFirmaRoutedComponent } from './component/conexion/conexion.admin.firma.routed/conexion.admin.firma.routed.component';
import { ConexionAdminAddRoutedComponent } from './component/conexion/conexion.admin.add.routed/conexion.admin.add.routed.component';
import { InmuebleAdminCreateByuserRoutedComponent } from './component/inmueble/inmueble.admin.create.byuser.routed/inmueble.admin.create.byuser.routed.component';
import { SharedRecuperarContraseñaComponent } from './shared/shared.recuperar.contraseña/shared.recuperar.contraseña.component';
import { SharedRestablecerContraseñaComponent } from './shared/shared.restablecer.contraseña/shared.restablecer.contraseña.component';
import { SharedByemailEditComponent } from './shared/shared.byemail.edit/shared.byemail.edit.component';

export const routes: Routes = [

  { path: 'login', component: SharedLoginRoutedComponent },
  { path: 'logout', component: SharedLogoutRoutedComponent },
  { path: '', component: SharedHomeRoutedComponent },
  { path: 'byemail/:email', component: SharedByemailRoutedComponent},
  { path: 'register', component: SharedRegistrerRoutedComponent },
  { path: 'forgot-password', component: SharedRecuperarContraseñaComponent },
  { path: 'reset-password/:id', component: SharedRestablecerContraseñaComponent },
  
  { path: 'byemail/edit/:email', component: SharedByemailEditComponent},
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
  {path: 'admin/inmueble/create/xsocio/:id', component: InmuebleAdminCreateByuserRoutedComponent,canActivate: [AdminGuard]},


  {path: 'client/inmueble/create', component: InmuebleClientCreateRoutedComponent,canActivate: [MiembroGuard]},
  {path: 'client/inmueble/view/:id', component:InmuebleClientViewRoutedComponent,canActivate: [MiembroGuard]},
  {path: 'client/inmueble/plist', component: InmuebleClientPlistRoutedComponent,canActivate: [MiembroGuard]},
  


  { path: 'admin/instalacion/plist', component: InstalacionAdminPlistRoutedComponent,canActivate: [AdminGuard] },
  {path: 'admin/instalacion/delete/:id', component: InstalacionAdminDeleteRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/instalacion/edit/:id', component: InstalacionAdminEditRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/instalacion/create', component: InstalacionAdminCreateRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/instalacion/view/:id', component: InstalacionAdminViewRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/plist/xsocio/:id', component :InmuebleXsocioAdminPlistRoutedComponent,canActivate: [AdminGuard]},
  {path: 'admin/inmueble/plist/xinstalacion/:id', component :InmuebleXinstalacionAdminPlistRoutedComponent,canActivate: [AdminGuard]},
 

{ path: 'admin/conexion/new', component: ConexionAdminCreateRoutedComponent,canActivate: [AdminGuard]},
{ path: 'admin/conexion/plist', component: ConexionAdminPlistRoutedComponent,canActivate: [AdminGuard] },
{ path: 'admin/conexion/delete/:id', component: ConexionAdminDeleteRoutedComponent,canActivate: [AdminGuard] },
{ path: 'admin/conexion/view/:id', component: ConexionAdminViewRoutedComponent,canActivate: [AdminGuard]},
{ path: 'admin/conexion/byinstalacion/plist/:id', component: ConexionByInstalacionAdminPlistRoutedComponent,canActivate: [AdminGuard] },
{ path: 'conexion/firma/:id', component: ConexionAdminFirmaRoutedComponent},
{ path: 'admin/conexion/add/:id', component: ConexionAdminAddRoutedComponent,canActivate: [AdminGuard]},



];
