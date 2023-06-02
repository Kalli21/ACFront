
export interface IUsuario {
  userName: string;
  nombres: string;
  correo: string;
  password: string;
  token: string;
  activo: boolean;
  productos: Producto[];
}

interface Producto {
  id: number;
  codProduct: string;
  nombre: string;
  descripcion: string;
  precio: number;
  urlImg: string;
  usuarioId: number;
  categoriaId: number;
  comentarios: Comentario[];
}

interface Comentario {
  id: number;
  contenido: string;
  fecha: string;
  productoId: number;
  clienteId: number;
  userName: string;
}