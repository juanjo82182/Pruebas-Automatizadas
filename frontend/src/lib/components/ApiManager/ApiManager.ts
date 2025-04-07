import { onMount } from 'svelte';
import { writable, get, type Writable } from 'svelte/store';
import type { Api } from '$lib/types';

export function createApiManager() {
  const apis = writable<Api[]>([]);
  const nombre = writable<string>('');
  const descripcion = writable<string>('');
  const endpoint = writable<string>('');
  const metodo = writable<Api['metodo']>('GET');
  const url = writable<string>('');
  const parametros = writable<string>('');
  const headers = writable<string>('');
  const auth = writable<string>('');
  const editingApi = writable<Api | null>(null);

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/apis');
      if (!response.ok) throw new Error('Error al obtener las APIs');
      const data = await response.json();
      apis.set(data);
    } catch (error) {
      console.error(error);
    }
  });

  async function handleSubmit() {
    const apiData: Partial<Api> = {
      nombre: get(nombre),
      descripcion: get(descripcion) || undefined,
      endpoint: get(endpoint),
      metodo: get(metodo),
      url: get(url),
      parametros: get(parametros) ? JSON.parse(get(parametros)) : undefined,
      headers: get(headers) ? JSON.parse(get(headers)) : undefined,
      auth: get(auth) || undefined,
    };

    let response;
    try {
      if (get(editingApi)) {
        response = await fetch(`http://localhost:3000/apis/${get(editingApi)?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        });
      } else {
        response = await fetch('http://localhost:3000/apis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        });
      }

      if (!response.ok) throw new Error('Error en la petición');
      const updatedApi: Api = await response.json();
      
      apis.update(currentApis => 
        get(editingApi) 
          ? currentApis.map(a => (a.id === updatedApi.id ? updatedApi : a))
          : [...currentApis, updatedApi]
      );
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  function editApi(api: Api) {
    editingApi.set(api);
    nombre.set(api.nombre);
    descripcion.set(api.descripcion || '');
    endpoint.set(api.endpoint);
    metodo.set(api.metodo);
    url.set(api.url);
    parametros.set(api.parametros ? JSON.stringify(api.parametros) : '');
    headers.set(api.headers ? JSON.stringify(api.headers) : '');
    auth.set(api.auth || '');
  }

  async function deleteApi(id: string) {
    try {
      const response = await fetch(`http://localhost:3000/apis/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar la API');
      apis.update(currentApis => currentApis.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  function resetForm() {
    nombre.set('');
    descripcion.set('');
    endpoint.set('');
    metodo.set('GET');
    url.set('');
    parametros.set('');
    headers.set('');
    auth.set('');
    editingApi.set(null);
  }

  return {
    apis,
    nombre,
    descripcion,
    endpoint,
    metodo,
    url,
    parametros,
    headers,
    auth,
    editingApi,
    handleSubmit,
    editApi,
    deleteApi,
    resetForm,
  };
}
