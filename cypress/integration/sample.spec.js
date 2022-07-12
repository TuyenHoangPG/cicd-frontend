context('Check cypress run successfully!', function() {
  beforeEach(function () {
    cy.visit(Cypress.config().baseUrl);
  })

  it('To verify open correct site', function() {
    cy.get('h3').contains('Fun Chat').should('exist')
  });
})