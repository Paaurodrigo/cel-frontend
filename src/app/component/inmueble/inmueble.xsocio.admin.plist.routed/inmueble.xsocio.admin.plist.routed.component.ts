import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inmueble.xsocio.admin.plist.routed',
  templateUrl: './inmueble.xsocio.admin.plist.routed.component.html',
  styleUrls: ['./inmueble.xsocio.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InmuebleXsocioAdminPlistRoutedComponent implements OnInit {

  oPage: IPage<IInmueble> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();

  oSocio: ISocio = {} as ISocio;

  constructor(
    private oInmuebleService: InmuebleService,
    private oSocioService: SocioService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute
  ) {
    this.debounceSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.nPage = 0;
      this.getPage();
    });
    // get id from route admin/Inmueble/plist/xSocio/:id
    this.oActivatedRoute.params.subscribe((params) => {
      this.oSocioService.get(params['id']).subscribe({
        next: (oSocio: ISocio) => {
          this.oSocio = oSocio;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    });
   }

   ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oInmuebleService
      .getPageXSocio(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oSocio.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<IInmueble>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/inmueble/edit/', oInmueble.id]);
  }

  view(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/inmueble/view/', oInmueble.id]);
  }

  remove(oInmueble: IInmueble) {
    this.oRouter.navigate(['admin/inmueble/delete/', oInmueble.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }

}
