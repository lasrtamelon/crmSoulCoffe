import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../productos-service';
import {computed, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-component.html'
})
export class ProductosComponent {

  constructor(private service: ProductosService) {}

  // getter que accede al servicio cuando ya existe
  get productos() {
    return this.service.productos();
  }

  form = signal<Producto>({
    id: undefined,
    nombre: '',
    origen: '',
    tipo: 'grano',
    grano: 'arabica',
    tueste:'Suave',
    intensidad: 1 ,
    precio: 0 ,
    stock: 0,
    ventas:0,
    imagen: ''

  });

  editar(p: Producto) {
    this.form.set({ ...p });
  }

  borrar(id: number) {
    this.service.eliminar(id).subscribe();
  }

  guardar() {
    const f = this.form();

    if (f.id) {
      this.service.actualizar(f).subscribe();
    } else {
      this.service.crear(f).subscribe();
    }

    this.form.set({
      id: undefined,
      nombre: '',
      origen: '',
      tipo: 'grano',
      grano: 'arabica',
      tueste: 'Suave',
      intensidad: 1,
      precio: 0,
      stock: 0,
      ventas:0,
      imagen: ''
    });
  }
}

