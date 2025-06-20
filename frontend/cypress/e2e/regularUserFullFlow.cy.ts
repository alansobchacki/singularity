describe("Full user flow: signup → login → create post -> follow someone", () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "Test1234!";
  const testName = `User ${Date.now()}`;

  it("should signup a new user", () => {
    cy.visit("/");

    cy.contains("Sign up").click();

    cy.url().should("include", "/signup");
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="name"]').type(testName);
    cy.get('input[name="password"]').type(testPassword);

    cy.get('button[type="submit"]').click();
    cy.wait(6000);

    cy.url().should("not.include", "/signup");
    cy.contains("Sign in to create content").should("be.visible");
  });

  it("should login with the new account", () => {
    cy.login(testEmail, testPassword);
  });

  it("should create a new post", () => {
    cy.login(testEmail, testPassword);

    cy.visit("/dashboard");
    cy.get('[data-cy="create-post-button"]').click();

    const postContent = "This is a post created during an automated test.";

    cy.get('textarea[name="body"]').type(postContent);
    cy.get('[data-cy="submit-post-button"]').should("not.be.disabled").click();

    cy.wait(3000);

    cy.contains(postContent).should("be.visible");
  });
});
