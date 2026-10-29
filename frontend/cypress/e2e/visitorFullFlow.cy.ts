describe("Visitor flow: browse the timeline without an account", () => {
  it("should view the timeline and the bot guessing game", () => {
    cy.visit("/dashboard");

    cy.get("#about-card").should("be.visible");
    cy.contains("Want to join the conversation?").should("be.visible");
    cy.contains("Human or bot?").should("be.visible");
  });
});
