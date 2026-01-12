import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class GatewayService {
  private authService: AxiosInstance;
  private puestosService: AxiosInstance;
  private productosService: AxiosInstance;
  private pedidosService: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.authService = axios.create({
      baseURL: this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001',
    });

    this.puestosService = axios.create({
      baseURL: this.configService.get<string>('PUESTOS_SERVICE_URL') || 'http://localhost:3002',
    });

    this.productosService = axios.create({
      baseURL: this.configService.get<string>('PRODUCTOS_SERVICE_URL') || 'http://localhost:3003',
    });

    this.pedidosService = axios.create({
      baseURL: this.configService.get<string>('PEDIDOS_SERVICE_URL') || 'http://localhost:3004',
    });
  }

  async proxyToAuth(method: string, path: string, data?: any, headers?: any) {
    try {
      const response = await this.authService.request({
        method: method.toLowerCase(),
        url: path,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async proxyToPuestos(method: string, path: string, data?: any, headers?: any) {
    try {
      const response = await this.puestosService.request({
        method: method.toLowerCase(),
        url: path,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async proxyToProductos(method: string, path: string, data?: any, headers?: any, params?: any) {
    try {
      const response = await this.productosService.request({
        method: method.toLowerCase(),
        url: path,
        data,
        headers,
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async proxyToPedidos(method: string, path: string, data?: any, headers?: any) {
    try {
      const response = await this.pedidosService.request({
        method: method.toLowerCase(),
        url: path,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Métodos para estadísticas del organizador
  async getEstadisticas(authToken?: string) {
    try {
      const headers = authToken ? { authorization: `Bearer ${authToken}` } : {};
      
      const [pedidos, puestos, productos] = await Promise.all([
        this.pedidosService.request({
          method: 'get',
          url: '/pedidos',
          headers,
        }),
        this.puestosService.request({
          method: 'get',
          url: '/puestos',
          headers,
        }),
        this.productosService.request({
          method: 'get',
          url: '/productos',
          headers,
        }),
      ]);

      // Calcular estadísticas
      const pedidosCompletados = pedidos.data.filter(
        (p: any) => p.status === 'entregado',
      ).length;

      const totalVentas = pedidos.data
        .filter((p: any) => p.status === 'entregado')
        .reduce((sum: number, p: any) => sum + parseFloat(p.total || 0), 0);

      // Ventas por puesto
      const ventasPorPuesto: Record<string, number> = {};
      pedidos.data
        .filter((p: any) => p.status === 'entregado')
        .forEach((p: any) => {
          ventasPorPuesto[p.stallId] = (ventasPorPuesto[p.stallId] || 0) + parseFloat(p.total || 0);
        });

      // Producto más vendido (simplificado)
      const productosVendidos: Record<string, number> = {};
      pedidos.data
        .filter((p: any) => p.status === 'entregado')
        .forEach((p: any) => {
          if (p.detalles) {
            p.detalles.forEach((d: any) => {
              productosVendidos[d.productId] =
                (productosVendidos[d.productId] || 0) + d.quantity;
            });
          }
        });

      const productoMasVendido = Object.entries(productosVendidos).sort(
        ([, a], [, b]) => b - a,
      )[0];

      return {
        totalPedidos: pedidos.data.length,
        pedidosCompletados,
        totalVentas,
        puestosActivos: puestos.data.filter((p: any) => p.status === 'activo').length,
        totalProductos: productos.data.length,
        ventasPorPuesto,
        productoMasVendido: productoMasVendido
          ? {
              productId: productoMasVendido[0],
              cantidadVendida: productoMasVendido[1],
            }
          : null,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): HttpException {
    if (error.response) {
      return new HttpException(
        error.response.data || error.message,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new HttpException(
      error.message || 'Error interno del servidor',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

