/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.visit("/");

  cy.get('input[name="email"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  cy.wait(3000);

  cy.url().should("not.include", "/login");
  cy.contains(`Hello`).should("be.visible");
  // cy.getCookie("accessToken").should("exist");
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
