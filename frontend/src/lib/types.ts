export interface Api {
    id: string;
    nombre: string;
    descripcion?: string;
    endpoint: string;
    metodo: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    parametros?: object;
    headers?: object;
    auth?: string;
    creado_en?: string;
    actualizado_en?: string;
  }