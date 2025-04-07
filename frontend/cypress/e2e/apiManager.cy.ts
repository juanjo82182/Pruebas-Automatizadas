describe('ApiManager UI Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/apis').as('getApis');
    cy.visit('/');
    cy.wait('@getApis');
  });

  it('should create a new API successfully', () => {
    cy.intercept('POST', 'http://localhost:3000/apis').as('createApi');

    cy.get('#nombre').type('API de Prueba');
    cy.get('#descripcion').type('Una API de prueba');
    cy.get('#endpoint').type('/prueba');
    cy.get('#metodo').select('GET');
    cy.get('#url').type('https://example.com');
    cy.get('#parametros').type('{"key": "value"}', { parseSpecialCharSequences: false });
    cy.get('#headers').type('{"Content-Type": "application/json"}', { parseSpecialCharSequences: false });
    cy.get('#auth').type('Bearer token123');

    cy.get('button[type="submit"]').click();

    cy.wait('@createApi').its('response.statusCode').should('eq', 200);

    cy.contains('td', 'API de Prueba', { timeout: 5000 }).should('exist');
  });

  it('should show validation errors for required fields', () => {
    // Simular blur en los campos requeridos para activar validaciones (bootstrap)
    cy.get('#nombre').focus().blur();
    cy.get('#endpoint').focus().blur();
    cy.get('#url').focus().blur();

    cy.get('button[type="submit"]').click();

    // Validación de campos requeridos
    cy.get('#nombre').should('have.class', 'is-invalid');
    cy.get('#nombre + .invalid-feedback').should('be.visible').invoke('text').should('include', 'obligatorio');

    cy.get('#endpoint').should('have.class', 'is-invalid');
    cy.get('#endpoint + .invalid-feedback').should('be.visible').invoke('text').should('include', 'obligatorio');

    cy.get('#url').should('have.class', 'is-invalid');
    cy.get('#url + .invalid-feedback').should('be.visible').invoke('text').should('include', 'obligatoria');

    // Ingresar datos inválidos
    cy.get('#nombre').clear().type('123');
    cy.get('#endpoint').clear().type('prueba');
    cy.get('#url').clear().type('invalid-url');
    cy.get('#parametros').clear().type('{invalid', { parseSpecialCharSequences: false });
    cy.get('#headers').clear().type('{invalid', { parseSpecialCharSequences: false });

    cy.get('button[type="submit"]').click();

    cy.get('#nombre + .invalid-feedback').should('be.visible').invoke('text').should('include', 'letras y espacios');
    cy.get('#endpoint + .invalid-feedback').should('be.visible').invoke('text').should('include', 'debe comenzar');
    cy.get('#url + .invalid-feedback').should('be.visible').invoke('text').should('include', 'formato válido');
    cy.get('#parametros + .invalid-feedback').should('be.visible').invoke('text').should('include', 'JSON válido');
    cy.get('#headers + .invalid-feedback').should('be.visible').invoke('text').should('include', 'JSON válido');
  });

  it('should edit an existing API', () => {
    cy.request('POST', 'http://localhost:3000/apis', {
      nombre: 'API Original',
      endpoint: '/original',
      metodo: 'POST',
      url: 'https://original.com',
    }).then((response) => {
      const apiId = response.body.id;

      cy.intercept('PUT', `http://localhost:3000/apis/${apiId}`).as('updateApi');
      cy.visit('/');
      cy.wait('@getApis');

      cy.contains('td', 'API Original').should('exist');
      cy.contains('tr', 'API Original').within(() => {
        cy.contains('button', 'Editar').click();
      });

      cy.get('#nombre').should('have.value', 'API Original').clear().type('API Editada');
      cy.get('#endpoint').should('have.value', '/original').clear().type('/editada');
      cy.get('#url').should('have.value', 'https://original.com').clear().type('https://editada.com');

      cy.get('button[type="submit"]').click();
      cy.wait('@updateApi').its('response.statusCode').should('eq', 200);

      cy.contains('td', 'API Editada', { timeout: 5000 }).should('exist');
      cy.contains('td', '/editada').should('exist');
    });
  });

  it('should delete an existing API', () => {
    cy.request('POST', 'http://localhost:3000/apis', {
      nombre: 'API a Eliminar',
      endpoint: '/eliminar',
      metodo: 'DELETE',
      url: 'https://eliminar.com',
    }).then((response) => {
      const apiId = response.body.id;

      cy.intercept('DELETE', `http://localhost:3000/apis/${apiId}`).as('deleteApi');
      cy.visit('/');
      cy.wait('@getApis');

      cy.contains('td', 'API a Eliminar').should('exist');
      cy.contains('tr', 'API a Eliminar').within(() => {
        cy.contains('button', 'Eliminar').click();
      });

      cy.wait('@deleteApi').its('response.statusCode').should('eq', 200);

      cy.contains('td', 'API a Eliminar', { timeout: 5000 }).should('not.exist');
    });
  });
});
