import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';

export interface Producto {
  id?: number;  
  nombre: string;
  origen: string;
  tipo: 'grano' | 'molido' | '';
  grano: 'arabica' | 'robusta' | 'liberica' | 'excelsa';
  tueste: 'Suave' | 'Medio' | 'Fuerte',
  intensidad: number;
  precio: number,
  stock: number,
  ventas: number,
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {

  private baseUrl = 'http://localhost:8080/api/producto';

  private _productos = signal<Producto[]>([]);
  productos = computed(() => this._productos());

  constructor(private http: HttpClient) {

    const inicial = toSignal(
      this.http.get<Producto[]>(this.baseUrl).pipe(
        map(d => d ?? []),
        tap(d => this._productos.set(d))
      ),
      { initialValue: [] as Producto[] }
    );

    this._productos.set(inicial());
  }

  recargar() {
    this.http.get<Producto[]>(this.baseUrl)
      .subscribe(lista => this._productos.set(lista ?? []));
  }

  crear(p: Producto) {
    return this.http.post<Producto>(this.baseUrl, p).pipe(
      tap(nuevo => this._productos.update(list => [...list, nuevo]))
    );
  }

  actualizar(p: Producto) {
    return this.http.put<Producto>(`${this.baseUrl}/${p.id}`, p).pipe(
      tap(act =>
        this._productos.update(lista =>
          lista.map(x => x.id === act.id? act : x)
        )
      )
    );
  }

  eliminar(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() =>
        this._productos.update(lista => lista.filter(x => x.id !== id))
      )
    );
  }
}
