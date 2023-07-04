import { Component, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GrafGeneralService } from '../../../services/dataInfo/graf-general.service';
import { ICategoriasFiltros } from 'src/app/analisis/interfaces/predic_sentiment/Request/ICategoriasFiltros';
import { CategoriaService } from '../../../services/predict_sentiment/categoria.service';
import { ICategoria } from '../../../interfaces/predic_sentiment/ICategoria';
import { tap } from 'rxjs';
import { DescargaPDFService } from '../../../services/dataInfo/descarga-pdf.service';

@Component({
  selector: 'app-filtros-pagina-general',
  templateUrl: './filtros-pagina-general.component.html',
  styleUrls: ['./filtros-pagina-general.component.css'],
})
export class FiltrosPaginaGeneralComponent {
  //InfoLolal
  userObj = localStorage.getItem('userInfo');
  id_user = -1;
  userName = localStorage.getItem('userName') || '';

  
  listCategorias: ICategoria[] = [];
  
  //DatePiker
  campaignOne: FormGroup = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  fechaIniSelect?: string;
  fechaFinSelect?: string;
  //Selecte Sentimiento
  selecSentimiento?: string;

  //Selecte Categoria
  selecCategoria?: ICategoria;

  constructor(public grafGeneralService: GrafGeneralService,
    private categoriaService: CategoriaService,
    private descargaPDFService: DescargaPDFService) {}
  
  requestDownloadGeneral() {
    this.descargaPDFService.requestDownloadGeneral();
  }

  ngOnInit() {
    // Restaurar valores guardados en localStorage
    const filtrosGeneral = localStorage.getItem('filtrosGeneral');
    if (filtrosGeneral) {
      const filters = JSON.parse(filtrosGeneral);
      this.selecCategoria = filters.selecCategoria;
      this.campaignOne.get('start')!.setValue(filters.startDate);
      this.campaignOne.get('end')!.setValue(filters.endDate);
      this.selecSentimiento = filters.sentimiento;
      this.selecCategoria = filters.categoria;
    }else{
      this.buscarData();
    }
     
    if (this.userObj) {
      const storedObj = JSON.parse(this.userObj);
      this.id_user = storedObj.id;
      this.obtenerCategorias(() => {
        if (this.selecCategoria && this.listCategorias.length > 0) {
          const matchingCategoria = this.listCategorias.find(cat => cat.id === this.selecCategoria?.id);
          this.selecCategoria = matchingCategoria;
        }
        
      });
    }
  }
  obtenerCategorias(callback: () => void) {
    this.categoriaService.getCategorias(this.userName).subscribe((d: any) => {
      this.listCategorias = d.result;
      callback();
    });
  }

  buscarData() {
    const lisCatIds:number[] = [];
    if(this.selecCategoria){
      lisCatIds.push(this.selecCategoria.id);
    }    

    let filtrosComentariosFecha: ICategoriasFiltros = {
      categoriasId : lisCatIds,
      fechaIni: this.fechaIniSelect,
      fechaFin: this.fechaFinSelect,
    }   

    let filtroSentimiento: number[] = [];

    if (!this.selecSentimiento || this.selecSentimiento === '') {
      filtroSentimiento = [0, 1, 2];
    }
    if (this.selecSentimiento === 'Positivo') {
      filtroSentimiento = [2];
    }
    if (this.selecSentimiento === 'Neutro') {
      filtroSentimiento = [1];
    }
    if (this.selecSentimiento === 'Negativo') {
      filtroSentimiento = [0];
    }

    this.grafGeneralService.ObtenerData(
      filtrosComentariosFecha,
      filtroSentimiento
    );
  }
  
  onSelectCategoria(){
    this.guardarValoresLocalStorage();
    this.buscarData();
  }
  onSelectSentimiento(selectedOption: string): void {
    this.guardarValoresLocalStorage();
    this.buscarData();
  }

  onDateSelect() {
    this.fechaIniSelect = this.campaignOne.value.start
      ? this.campaignOne.value.start.toISOString()
      : null;
    this.fechaFinSelect = this.campaignOne.value.end
      ? this.campaignOne.value.end.toISOString()
      : null;
    this.guardarValoresLocalStorage();
    this.buscarData();
  }
  clearDates(): void {
    this.campaignOne.setValue({
      start: null,
      end: null,
    });
    this.fechaIniSelect = undefined;
    this.fechaFinSelect = undefined;    
    this.guardarValoresLocalStorage();
    this.buscarData();
  }

  //Variables locales
  guardarValoresLocalStorage() {
    const filtrosGeneral = {
      selectedCategoria: this.selecCategoria,
      startDate: this.campaignOne.get('start')!.value,
      endDate: this.campaignOne.get('end')!.value,
      sentimiento: this.selecSentimiento,
      categoria: this.selecCategoria,
    };
    localStorage.setItem('filtrosGeneral', JSON.stringify(filtrosGeneral));

    // Otros valores a guardar...
  }
}
