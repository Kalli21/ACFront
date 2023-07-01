import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable,  map, mergeMap } from 'rxjs';
import { IProducto } from '../../../interfaces/predic_sentiment/IProducto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProductoService } from '../../../services/predict_sentiment/producto.service';
import { IProductosFiltros } from '../../../interfaces/predic_sentiment/Request/IProductosFiltros';
import { GrafProductoService } from '../../../services/dataInfo/graf-producto.service';
import { IComentariosFiltros } from '../../../interfaces/predic_sentiment/Request/IComentariosFiltros';
import { TopicModelingService } from '../../../services/topicModel/topic-modeling.service';

@Component({
  selector: 'app-filtros-pagina-productos',
  templateUrl: './filtros-pagina-productos.component.html',
  styleUrls: ['./filtros-pagina-productos.component.css']
})
export class FiltrosPaginaProductosComponent {
 
    //InfoLolal
    userObj = localStorage.getItem('userInfo');
    id_user = -1
    userName = localStorage.getItem('userName') || '';
  
  
    //DatePiker
    campaignOne: FormGroup = new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    });
    fechaIniSelect?: string;
    fechaFinSelect?: string;
    //Selecte Sentimiento
    selecSentimiento?:string;
  
    //Selecte Categoria
    selecCategoria = 'None';
    
    //Selecte tema
    selecTema?: number;
    listaTemas: string[] = [] ;
  
    constructor(private router: Router,
      private productoService:ProductoService,
      public grafProductoService: GrafProductoService,
      private topicModelingService: TopicModelingService) {
      
    }
  
    isPageProduct(): boolean {
      return this.router.url.startsWith('/analisis/producto');
    }
    isPageGeneral(): boolean {
      return this.router.url.startsWith('/analisis/general');
    }
    
    //Buscardor Producto
     
    @Output() infoProducto: EventEmitter<IProducto> = new EventEmitter<IProducto>();
    productoFiltro: IProductosFiltros = {
      nombre : ''
    };
  
    myControl = new FormControl('');
    options: IProducto[] = [];
    selectedProduct?: IProducto ;
    filteredOptions: Observable<IProducto[]> = new Observable<IProducto[]>();
  
    ngOnInit() {   
        // Restaurar valores guardados en localStorage
      const filtrosProducto = localStorage.getItem('filtrosProducto');
      if (filtrosProducto) {
        const filters = JSON.parse(filtrosProducto);
        this.selectedProduct = filters.selectedProduct;
        this.campaignOne.get('start')!.setValue(filters.startDate);
        this.campaignOne.get('end')!.setValue(filters.endDate);
        this.selecSentimiento = filters.sentimiento;
        this.selecCategoria = filters.categoria;
        this.selecTema = filters.tema;
        
        //Emeiter Producto Info
        this.infoProducto.emit(this.selectedProduct);  
  
      }
  
        if (this.userObj) {
          const storedObj = JSON.parse(this.userObj);
          this.id_user = storedObj.id;
        }
        
        if ( this.isPageProduct() ){
          this.obtenerTemas();
          this.buscadorProducto();
        }
    }
    
   
    
    obtenerTemas(){
      if (this.id_user!==-1) {
        this.topicModelingService.getTemas(this.userName, 4).subscribe( (resp:any) => {
          Object.keys(resp).forEach((clave) => {
            const dic2 = resp[clave];
            const clavesDic2 = Object.keys(dic2);
            const numerosClaves = clavesDic2.map((clave) => parseFloat(clave));
            const mayorKey = Math.max(...numerosClaves);
            const valor = dic2[mayorKey.toString()];
            this.listaTemas.push(valor);
          });
          
        });
      }
      
    }
  
    buscadorProducto() {
      if (this.id_user!==-1) {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          mergeMap(value => {
            if (value !== null) {
              this.productoFiltro.nombre = value;
            } else {
              this.productoFiltro.nombre = '';
            }
            
            return this.productoService.getProductosConFiltros(this.id_user, this.productoFiltro);
          }),
          map(result => {
            if (result.hasOwnProperty('result')) {
              return (result as any).result as IProducto[]; // Realizar la conversión de tipo a IProducto[]
            } else {
              return [] as IProducto[]; // Devolver una lista vacía como IProducto[]
            }
            
          })
        );
           
      this.campaignOne.valueChanges.subscribe((value) => {
        if (value.start && value.end ) {
          this.fechaIniSelect = value.start.toISOString();
          this.fechaFinSelect = value.end.toISOString();          
        }
      });
  
      }
    } 
  
  
    buscarData(){
       
      let filtrosComentariosFecha: IComentariosFiltros = {
        idProducto : this.selectedProduct?.id,
        fechaIni : this.fechaIniSelect,
        fechaFin : this.fechaFinSelect
      }
  
      let filtroSentimiento: number[] = [];
      
      let filtroTemas: number[] = [];
      
      if ( this.selecTema ){
        filtroTemas.push(this.selecTema);
      }else{
        filtroTemas = []
      }
  
      if (!this.selecSentimiento || this.selecSentimiento === ''){
        filtroSentimiento = [0,1,2];
      }
      if (this.selecSentimiento === 'Positivo'){
        filtroSentimiento = [2];
      }
      if (this.selecSentimiento === 'Neutro'){
        filtroSentimiento = [1];
      }
      if (this.selecSentimiento === 'Negativo'){
        filtroSentimiento = [0];
      }
  
      this.grafProductoService.obtenerData(filtrosComentariosFecha,filtroTemas,filtroSentimiento);
    
    }
  
    displayOption(option: IProducto): string {
      return option ? option.nombre : '';
    }
  
    onSelectTema(selectedOption: string): void {
      this.guardarValoresLocalStorage();
      this.buscarData();
    }
    
    onSelectSentimiento(selectedOption: string): void {
      this.guardarValoresLocalStorage();
      this.buscarData();
    }
  
    onProductSelected(event: MatAutocompleteSelectedEvent) {
      this.selectedProduct = event.option.value;
      this.guardarValoresLocalStorage();
      this.infoProducto.emit(this.selectedProduct);    
      this.buscarData();  
    }
  
    onDateSelect(){         
      this.fechaIniSelect = this.campaignOne.value.start ? this.campaignOne.value.start.toISOString() : null;
      this.fechaFinSelect = this.campaignOne.value.end ? this.campaignOne.value.end.toISOString() : null;
      this.guardarValoresLocalStorage();
      this.buscarData();    
    }
    clearDates(): void {
      this.campaignOne.setValue({
        start: null,
        end: null
      });
      this.fechaIniSelect = undefined;
      this.fechaFinSelect = undefined; 
      this.guardarValoresLocalStorage();
      this.buscarData();      
    }
  
    //Variables locales
    guardarValoresLocalStorage() {
      const filtrosProducto = {
        selectedProduct: this.selectedProduct,
        startDate: this.campaignOne.get('start')!.value,
        endDate: this.campaignOne.get('end')!.value,
        sentimiento: this.selecSentimiento,
        categoria: this.selecCategoria,
        tema: this.selecTema
      };
      localStorage.setItem('filtrosProducto', JSON.stringify(filtrosProducto));
    
      // Otros valores a guardar...
    }
  
}
