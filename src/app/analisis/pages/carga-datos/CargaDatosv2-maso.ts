guardarDatos(data: [IDataCSV]) {
    let cat: ICategoria;
    let prod: IProducto;
    let cli: ICliente;
    let com: IComentario;
  
    const userName = localStorage.getItem('userName');
    const objUser = localStorage.getItem('userInfo');
    let userid = 0;
    if (objUser) {
      const obj = JSON.parse(objUser);
      userid = obj.id;
    }
  
    if (userName) {
      of(...data).pipe(
        concatMap((e: IDataCSV) => {
          cat = {
            id: 0,
            nombre: e.NombreCategoria || '',
            productos: [],
            userName: userName || ''
          };
  
          return this.cartegoriaServices.crearCategoria(cat).pipe(
            map((data: any) => {
              cat.id = data.result.id;
              return cat;
            })
          ) as ObservableInput<any>;
        }),
        toArray(),
        tap((categorias: ICategoria[]) => {
          console.log('Categorías insertadas:', categorias);
        }),
        map((categorias: ICategoria[]) => categorias.map((categoria: ICategoria) => {
          // Realiza cualquier operación adicional con la categoría insertada aquí
          console.log('Operación adicional con la categoría:', categoria);
          return of(categoria);
        })),
        concatAll()
      ).subscribe(() => {
        console.log('Todas las operaciones adicionales han sido completadas.');
      });
    }
  }