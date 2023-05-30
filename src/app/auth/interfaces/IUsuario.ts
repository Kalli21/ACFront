

export interface IUsuario {
  userName: string;
  password: string;
  token: string;
  activo: boolean;
  productos: Producto[];
}

interface Producto {
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  usuarioId: number;
  categoriID: number;
  comentarios: Comentario[];
}

interface Comentario {
  ComentarioId: number;
  contenido: string;
  fecha: string;
  productoId: number;
  clienteId: number;
}