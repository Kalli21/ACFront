import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICliente } from '../../interfaces/ICliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  baserUrl: string = environment.apiUrl + '/api/Cliente/';

  constructor(private http: HttpClient) { }

  getClientes() {

    return this.http.get(this.baserUrl);
  }

  getCliente(id: number) {

    return this.http.get(this.baserUrl + id);
  }

  crearCliente(cliente: ICliente) {

    return this.http.post(this.baserUrl, cliente);
  }

  actualizarCliente(id: number, cliente: ICliente) {

    return this.http.put(this.baserUrl + id, cliente);
  }

  deleteCliente(id: number) {

    return this.http.delete(this.baserUrl + id);
  }
}
