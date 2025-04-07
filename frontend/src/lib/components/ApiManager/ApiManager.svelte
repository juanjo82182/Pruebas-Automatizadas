<script lang="ts">
  import { createApiManager } from './ApiManager';
  import { writable } from 'svelte/store';

  const {
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
  } = createApiManager();

  // Estados para errores como store reactivo
  const errors = writable({
    nombre: '',
    endpoint: '',
    url: '',
    parametros: '',
    headers: '',
  });

  // Validaciones
  function validateNombre(value: string): string {
    if (!value) return 'El nombre es obligatorio';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'El nombre solo puede contener letras y espacios';
    return '';
  }

  function validateEndpoint(value: string): string {
    if (!value) return 'El endpoint es obligatorio';
    if (!value.startsWith('/')) return "El endpoint debe comenzar con ' / '";
    return '';
  }

  function validateUrl(value: string): string {
    if (!value) return 'La URL es obligatoria';
    try {
      new URL(value);
      return '';
    } catch {
      return 'La URL debe tener un formato válido (ej. https://example.com)';
    }
  }

  function validateJson(value: string): string {
    if (!value) return ''; // Permitir vacío
    try {
      JSON.parse(value);
      return '';
    } catch {
      return 'Debe ser un JSON válido (ej. {"key": "value"})';
    }
  }

  // Validación en tiempo real para cada campo
  function validateField(field: keyof typeof $errors, value: string) {
    errors.update((current) => ({
      ...current,
      [field]: field === 'nombre' ? validateNombre(value) :
               field === 'endpoint' ? validateEndpoint(value) :
               field === 'url' ? validateUrl(value) :
               field === 'parametros' ? validateJson(value) :
               validateJson(value),
    }));
  }

  // Validación completa al enviar
  function validateForm(): boolean {
    errors.update((current) => ({
      ...current,
      nombre: validateNombre($nombre),
      endpoint: validateEndpoint($endpoint),
      url: validateUrl($url),
      parametros: validateJson($parametros),
      headers: validateJson($headers),
    }));

    return !Object.values($errors).some(error => error !== '');
  }

  // Manejo del envío con validación
  function onSubmit(e: Event) {
    e.preventDefault();
    validateForm(); // Siempre validar para mostrar errores
    if (!Object.values($errors).some(error => error !== '')) {
      handleSubmit();
    }
  }
</script>

<div class="container my-5">
  <h1 class="text-center mb-4">Gestión de Servicios Web</h1>

  <!-- Formulario -->
  <form on:submit={onSubmit} class="card p-4 mb-4 shadow-sm">
    <div class="row g-3">
      <div class="col-md-6">
        <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
        <input
          id="nombre"
          bind:value={$nombre}
          class="form-control {$errors.nombre ? 'is-invalid' : ''}"
          placeholder="Nombre"
          required
          on:input={(e) => validateField('nombre', e.currentTarget.value)}
          on:blur={(e) => validateField('nombre', e.currentTarget.value)}
        />
        {#if $errors.nombre}
          <div class="invalid-feedback">{$errors.nombre}</div>
        {/if}
      </div>
      <div class="col-md-6">
        <label for="descripcion" class="form-label">Descripción</label>
        <input
          id="descripcion"
          bind:value={$descripcion}
          class="form-control"
          placeholder="Descripción"
        />
      </div>
      <div class="col-md-6">
        <label for="endpoint" class="form-label">Endpoint <span class="text-danger">*</span></label>
        <input
          id="endpoint"
          bind:value={$endpoint}
          class="form-control {$errors.endpoint ? 'is-invalid' : ''}"
          placeholder="/Endpoint"
          required
          on:input={(e) => validateField('endpoint', e.currentTarget.value)}
          on:blur={(e) => validateField('endpoint', e.currentTarget.value)}
        />
        {#if $errors.endpoint}
          <div class="invalid-feedback">{$errors.endpoint}</div>
        {/if}
      </div>
      <div class="col-md-6">
        <label for="metodo" class="form-label">Método</label>
        <select id="metodo" bind:value={$metodo} class="form-select">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
      <div class="col-12">
        <label for="url" class="form-label">URL <span class="text-danger">*</span></label>
        <input
          id="url"
          bind:value={$url}
          class="form-control {$errors.url ? 'is-invalid' : ''}"
          placeholder="URL"
          required
          on:input={(e) => validateField('url', e.currentTarget.value)}
          on:blur={(e) => validateField('url', e.currentTarget.value)}
        />
        {#if $errors.url}
          <div class="invalid-feedback">{$errors.url}</div>
        {/if}
      </div>
      <div class="col-md-6">
        <label for="parametros" class="form-label">Parámetros (JSON)</label>
        <input
          id="parametros"
          bind:value={$parametros}
          class="form-control {$errors.parametros ? 'is-invalid' : ''}"
          placeholder={JSON.stringify({ key: "value" })}
          on:input={(e) => validateField('parametros', e.currentTarget.value)}
          on:blur={(e) => validateField('parametros', e.currentTarget.value)}
        />
        {#if $errors.parametros}
          <div class="invalid-feedback">{$errors.parametros}</div>
        {/if}
      </div>
      <div class="col-md-6">
        <label for="headers" class="form-label">Headers (JSON)</label>
        <input
          id="headers"
          bind:value={$headers}
          class="form-control {$errors.headers ? 'is-invalid' : ''}"
          placeholder={JSON.stringify({ "Content-Type": "application/json" })}
          on:input={(e) => validateField('headers', e.currentTarget.value)}
          on:blur={(e) => validateField('headers', e.currentTarget.value)}
        />
        {#if $errors.headers}
          <div class="invalid-feedback">{$errors.headers}</div>
        {/if}
      </div>
      <div class="col-12">
        <label for="auth" class="form-label">Autenticación</label>
        <input
          id="auth"
          bind:value={$auth}
          class="form-control"
          placeholder="Autenticación"
        />
      </div>
      <div class="col-12 text-end">
        <button type="submit" class="btn btn-primary me-2">
          {$editingApi ? 'Actualizar' : 'Crear'}
        </button>
        {#if $editingApi}
          <button type="button" on:click={resetForm} class="btn btn-secondary">Cancelar</button>
        {/if}
      </div>
    </div>
  </form>

  <!-- Tabla -->
  <div class="table-responsive">
    <table class="table table-bordered align-middle">
      <thead class="table-dark">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Endpoint</th>
          <th scope="col">Método</th>
          <th scope="col">URL</th>
          <th scope="col">Parámetros</th>
          <th scope="col">Headers</th>
          <th scope="col">Auth</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each $apis as api (api.id)}
          <tr>
            <td class="text-wrap">{api.nombre}</td>
            <td class="text-wrap">{api.descripcion || '-'}</td>
            <td class="text-wrap">{api.endpoint}</td>
            <td>
              <span class="badge bg-{api.metodo === 'GET' ? 'success' : api.metodo === 'POST' ? 'primary' : api.metodo === 'PUT' ? 'warning' : api.metodo === 'DELETE' ? 'danger' : 'info'}">
                {api.metodo}
              </span>
            </td>
            <td class="text-wrap">{api.url}</td>
            <td class="text-wrap">{api.parametros ? JSON.stringify(api.parametros) : '-'}</td>
            <td class="text-wrap">{api.headers ? JSON.stringify(api.headers) : '-'}</td>
            <td class="text-wrap">{api.auth || '-'}</td>
            <td>
              <button on:click={() => editApi(api)} class="btn btn-sm btn-outline-primary me-2">Editar</button>
              <button on:click={() => deleteApi(api.id)} class="btn btn-sm btn-outline-danger">Eliminar</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  @import './ApiManager.css';
</style>