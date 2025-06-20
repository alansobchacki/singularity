describe("Homepage", () => {
  it("loads the home page", () => {
    cy.visit("/");
    cy.contains("Sign in to create content").should("be.visible");
  });
});
