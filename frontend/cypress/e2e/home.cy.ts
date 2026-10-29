describe("Homepage", () => {
  it("redirects to the public timeline", () => {
    cy.visit("/");
    cy.url().should("include", "/dashboard");
    cy.contains("Full-stack software engineer").should("be.visible");
  });
});
