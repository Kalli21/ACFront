import { Component, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GrafGeneralService } from '../../../services/dataInfo/graf-general.service';
import { CategoriaService } from '../../../services/predict_sentiment/categoria.service';
import { ICategoria } from '../../../interfaces/predic_sentiment/ICategoria';

import { DescargaPDFService } from '../../../services/dataInfo/descarga-pdf.service';
import { IInfoFiltro } from 'src/app/analisis/interfaces/webApi/Request/IInfoFiltro';

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
  
  primerInicio = localStorage.getItem('primerInicio') || '';

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

  constructor(
    public grafGeneralService: GrafGeneralService,
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

      this.fechaIniSelect = filters.startDate;
      this.fechaFinSelect = filters.endDate;

    }
    
    if (this.primerInicio === 'true') {
      localStorage.setItem('primerInicio','false');
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
    this.userName = localStorage.getItem('userName') || '';
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
    
    let filtroInfo: IInfoFiltro = {
      CT_filtro_com : {
        fechaIni : this.fechaIniSelect,
        fechaFin : this.fechaFinSelect,
        categoriasId : filtroSentimiento,
      },      
      PS_filtros_com : {
        fechaIni : this.fechaIniSelect,
        fechaFin : this.fechaFinSelect,
        categoriasId : lisCatIds.length > 0 ? lisCatIds : undefined,
        userName : this.userName,
      },
      DT_filtros_com : {
        fechaIni : this.fechaIniSelect,
        fechaFin : this.fechaFinSelect,
      },
      cant_ranking : 10,
    }
    
    this.grafGeneralService.ObtenerData(filtroInfo);
  }
  
  onSelectCategoria(){
    this.guardarValoresLocalStorage();
  }

  onSelectSentimiento(selectedOption: string): void {
    this.guardarValoresLocalStorage();
  }

  onDateSelect() {
    this.fechaIniSelect = this.campaignOne.value.start
      ? this.campaignOne.value.start.toISOString()
      : null;
    this.fechaFinSelect = this.campaignOne.value.end
      ? this.campaignOne.value.end.toISOString()
      : null;
    this.guardarValoresLocalStorage();
  }

  clearDates(): void {
    this.campaignOne.setValue({
      start: null,
      end: null,
    });
    this.fechaIniSelect = undefined;
    this.fechaFinSelect = undefined;    
    this.guardarValoresLocalStorage();
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
