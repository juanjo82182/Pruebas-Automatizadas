/// <reference types="cypress" />

// Extender la interfaz Chainable para añadir comandos personalizados
declare namespace Cypress {
  interface Chainable {
    resetDatabase(): Chainable<void>;
    seedApi(api: object): Chainable<void>;
  }
}


Cypress.Commands.add('seedApi', (api) => {
  cy.request('POST', 'http://localhost:3000/apis', api);
});