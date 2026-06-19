/** Base de la API REST (mismo host en producción SSR). */
export const API_BASE = '/api';

export const API = {
  health: `${API_BASE}/health`,
  productos: `${API_BASE}/productos`,
  productosActivos: `${API_BASE}/productos/activos`,
  producto: (id: string) => `${API_BASE}/productos/${id}`,
  productoBySlug: (slug: string) => `${API_BASE}/productos/slug/${slug}`,
  productoToggle: (id: string) => `${API_BASE}/productos/${id}/toggle`,
  productoStock: (id: string) => `${API_BASE}/productos/${id}/stock`,
  mesas: `${API_BASE}/mesas`,
  mesa: (id: string) => `${API_BASE}/mesas/${id}`,
  mesaToggle: (id: string) => `${API_BASE}/mesas/${id}/toggle`,
  pedidos: `${API_BASE}/pedidos`,
  pedido: (id: string) => `${API_BASE}/pedidos/${id}`,
  pedidoEstado: (id: string) => `${API_BASE}/pedidos/${id}/estado`,
  eventos: `${API_BASE}/eventos`,
  evento: (id: string) => `${API_BASE}/eventos/${id}`,
  eventoToggleActivo: (id: string) => `${API_BASE}/eventos/${id}/toggle-activo`,
  eventoToggleDestacado: (id: string) => `${API_BASE}/eventos/${id}/toggle-destacado`,
  movimientos: `${API_BASE}/movimientos`,
  movimiento: (id: string) => `${API_BASE}/movimientos/${id}`,
  inventarioMovimiento: `${API_BASE}/inventario/movimiento`,
} as const;
