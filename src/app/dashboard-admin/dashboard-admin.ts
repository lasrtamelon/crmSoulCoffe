import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

import { ClientesService, Cliente } from '../clientes-service';
import { ProductosService, Producto } from '../productos-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.html'
})
export class DashboardComponent implements AfterViewInit {

  productos!: () => Producto[];

  constructor(
    private clientesService: ClientesService,
    private productosService: ProductosService
  ) {
    this.productos = this.productosService.productos;
  }

  // ======================================================
  //   PALETA DE COLORES (COFFEE THEME)
  // ======================================================
  colores = [
    "#d9a46b", "#c67c48", "#a05a2c", "#7e3f1d",
    "#e3c7a8", "#b86b40", "#9f5233", "#6b2f14",
    "#ffb97a", "#d6884d", "#b06a33", "#8a4f1d"
  ];

  // ======================================================
  // FORM CLIENTE
  // ======================================================
  clienteForm = signal<Cliente>({
    id: undefined,
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: ''
  });

  setClienteField(field: keyof Cliente, value: any) {
    this.clienteForm.update(f => ({ ...f, [field]: value }));
  }

  crearCliente() {
    this.clientesService.crear(this.clienteForm()).subscribe(() => {
      this.clienteForm.set({
        id: undefined,
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        telefono: ''
      });
    });
  }

  // ======================================================
  // FORM PRODUCTO
  // ======================================================
  productoForm = signal<Producto>({
    id: undefined,
    nombre: '',
    origen: '',
    tipo: 'grano',
    grano: 'arabica',
    tueste: 'Suave',
    intensidad: 1,
    precio: 0,
    stock: 0,
    ventas: 0,
    imagen: ''
  });

  setProductoField(field: keyof Producto, value: any) {
    this.productoForm.update(f => ({ ...f, [field]: value }));
  }

  crearProducto() {
    this.productosService.crear(this.productoForm()).subscribe(() => {
      this.productoForm.set({
        id: undefined,
        nombre: '',
        origen: '',
        tipo: 'grano',
        grano: 'arabica',
        tueste: 'Suave',
        intensidad: 1,
        precio: 0,
        stock: 0,
        ventas: 0,
        imagen: ''
      });
    });
  }

  // ======================================================
  //            GRÁFICAS
  // ======================================================
  stockChart!: Chart;
  ventasChart!: Chart;

  ngAfterViewInit() {
    setTimeout(() => {
      this.crearGraficas();
    }, 50);

    effect(() => {
      setTimeout(() => this.actualizarGraficas(), 50);
    });
  }

  crearGraficas() {
    const productos = this.productos();

    const nombres = productos.map((p: Producto) => p.nombre);
    const stock = productos.map((p: Producto) => p.stock);
    const ventas = productos.map((p: Producto) => p.ventas);

    // ======================================================
    // STOCK - GRÁFICA DE BARRAS
    // ======================================================
    this.stockChart = new Chart('stockChart', {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Stock',
          data: stock,
          backgroundColor: this.colores,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#eee" },
            grid: { color: "#ffffff20" }
          },
          x: {
            ticks: { color: "#eee" },
            grid: { color: "#ffffff10" }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#fff',
              boxWidth: 12,
              font: { size: 12 }
            }
          }
        }
      }
    });


    // ===========================
    // TOP VENTAS - LINE CHART
    // ===========================
    this.ventasChart = new Chart('ventasChart', {
      type: 'line',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Ventas',
          data: ventas,
          borderColor: '#ffa65c',
          backgroundColor: '#ffa65c60',
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#fff',
              font: { size: 12 }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#eee' },
            grid: { color: '#ffffff15' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#eee' },
            grid: { color: '#ffffff15' }
          }
        }
      }
    });
  }

  actualizarGraficas() {
    const productos = this.productos();

    const nombres = productos.map((p: Producto) => p.nombre);
    const stock = productos.map((p: Producto) => p.stock);
    const ventas = productos.map((p: Producto) => p.ventas);

    this.stockChart.data.labels = nombres;
    this.stockChart.data.datasets[0].data = stock;
    this.stockChart.update();

    this.ventasChart.data.labels = nombres;
    this.ventasChart.data.datasets[0].data = ventas;
    this.ventasChart.update();
  }
}
