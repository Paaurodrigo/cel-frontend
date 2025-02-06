import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../service/session.service";
import { map, Observable } from "rxjs";
import { ISocio } from "../model/socio.interface";
import { SocioService } from "../service/socio.service";

@Injectable({
    providedIn: 'root'
})

export class MiembroGuard implements CanActivate {

    constructor(private oSessionService: SessionService,
        private oSocioService: SocioService,
        private oRouter: Router) { }

    canActivate(): Observable<boolean> {
        if (this.oSessionService.isSessionActive()) {
            let email: string = this.oSessionService.getSessionEmail();
            // llamar al servidor para obtener el rol del Socio
            return this.oSocioService.getSocioByEmail(email).pipe(
                map((data: ISocio) => {
                    if (data.tiposocio.descripcion === 'Auditor') {
                        return true;
                    } else {
                        this.oRouter.navigate(['/login']);
                        return false;
                    }
                })
            );        
        } else {
            this.oRouter.navigate(['/login']);
            return new Observable<boolean>(observer => {
                observer.next(false);
                observer.complete();
            });
        }
    }

}
