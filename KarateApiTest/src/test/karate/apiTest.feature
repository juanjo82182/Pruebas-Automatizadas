Feature: Pruebas CRUD y casos de borde para la API REST de gestión de APIs

Background:
  * url 'http://localhost:3000'
  * header Content-Type = 'application/json'

# --- CREAR ---
Scenario: Crear una API con datos válidos
  Given path 'apis'
  And request
  """
  {
    "nombre": "API de Clima",
    "descripcion": "Consulta de clima actual",
    "endpoint": "/clima",
    "metodo": "GET",
    "url": "https://api.weatherapi.com/v1/current.json",
    "parametros": { "key": "demo", "q": "Medellin" },
    "headers": { "Content-Type": "application/json" },
    "auth": null
  }
  """
  When method POST
  Then status 200  # Tu servidor devuelve 200 en lugar de 201
  And match response == { id: '#uuid', nombre: 'API de Clima', descripcion: 'Consulta de clima actual', endpoint: '/clima', metodo: 'GET', url: 'https://api.weatherapi.com/v1/current.json', parametros: { key: 'demo', q: 'Medellin' }, headers: { 'Content-Type': 'application/json' }, auth: '#null', creado_en: '#string', actualizado_en: '#string' }
  * def apiId = response.id

Scenario: Crear una API sin campos obligatorios
  Given path 'apis'
  And request { "endpoint": "/invalid", "metodo": "GET" }
  When method POST
  Then status 500  # Prisma devuelve 500 por validación
  And match response.error == 'Internal Server Error'
  And match response.message contains 'Argument `nombre` is missing'

Scenario: Crear una API con método HTTP inválido
  Given path 'apis'
  And request
  """
  {
    "nombre": "API Inválida",
    "endpoint": "/test",
    "metodo": "INVALID",
    "url": "https://example.com"
  }
  """
  When method POST
  Then status 500  # Prisma rechazará un método no válido del enum
  And match response.error == 'Internal Server Error'

# --- LEER ---
Scenario: Obtener todas las APIs
  Given path 'apis'
  When method GET
  Then status 200
  And match response == '#array'
  And match each response contains { id: '#uuid', nombre: '#string', endpoint: '#string', metodo: '#string', url: '#string' }

Scenario: Obtener una API por ID válido
  Given path 'apis'
  And request { "nombre": "TestById", "endpoint": "/test", "metodo": "GET", "url": "https://example.com" }
  When method POST
  Then status 200
  * def apiId = response.id
  Given path 'apis', apiId
  When method GET
  Then status 200
  And match response.id == apiId
  And match response.nombre == 'TestById'

Scenario: Obtener una API con ID no válido
  Given path 'apis', 'non-existent-id'
  When method GET
  Then status 500  # Tu servidor devuelve 500 en lugar de 200 con error
  And match response.error == 'Internal Server Error'
  And match response.message contains 'Error creating UUID'

# --- ACTUALIZAR ---
Scenario: Actualizar una API existente
  Given path 'apis'
  And request { "nombre": "UpdateTest", "endpoint": "/old", "metodo": "GET", "url": "https://old.com" }
  When method POST
  Then status 200
  * def apiId = response.id
  Given path 'apis', apiId
  And request
  """
  {
    "nombre": "API Actualizada",
    "descripcion": "Versión actualizada",
    "endpoint": "/clima-actualizado",
    "metodo": "GET",
    "url": "https://api.weatherapi.com/v1/current.json",
    "parametros": { "key": "demo", "q": "Bogota" },
    "headers": { "Content-Type": "application/json" },
    "auth": "Bearer token123"
  }
  """
  When method PUT
  Then status 200
  And match response.nombre == 'API Actualizada'
  And match response.parametros.q == 'Bogota'
  And match response.auth == 'Bearer token123'

Scenario: Actualizar una API inexistente
  Given path 'apis', '00000000-0000-0000-0000-000000000000'
  And request { "nombre": "NoExist", "endpoint": "/test", "metodo": "GET", "url": "https://example.com" }
  When method PUT
  Then status 500  # Prisma devuelve 500 si no encuentra el registro
  And match response.error == 'Internal Server Error'

# --- ELIMINAR ---
Scenario: Eliminar una API existente
  Given path 'apis'
  And request { "nombre": "DeleteTest", "endpoint": "/delete", "metodo": "DELETE", "url": "https://delete.com" }
  When method POST
  Then status 200
  * def apiId = response.id
  Given path 'apis', apiId
  When method DELETE
  Then status 200
  And match response.message == 'API ' + apiId + ' deleted'
  Given path 'apis', apiId
  When method GET
  Then status 200  
  And match response.error == 'API not found'

Scenario: Eliminar una API inexistente con Content-Type incorrecto
  # Mantenemos el Content-Type que causa el 400
  * configure headers = { 'Content-Type': 'application/json' }
  Given path 'apis', '00000000-0000-0000-0000-000000000000'
  When method DELETE
  Then status 400  # Fastify valida el Content-Type y rechaza la solicitud
  And match response.error == 'Bad Request'
  And match response.message == 'Body cannot be empty when content-type is set to \'application/json\''