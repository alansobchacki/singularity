describe("Full spectator user flow: login → view timeline", () => {
  it("should login as a spectator", () => {
    cy.spectatorLogin();
  });

  it("should view the timeline", () => {
    cy.spectatorLogin();
    cy.visit("/dashboard");
    cy.contains("Spectators can't like or create content.").should(
      "be.visible"
    );
  });
});
