context('Check cypress run successfully!', function() {
  beforeEach(function () {
    cy.visit(Cypress.config().baseUrl);
  })

  it('To verify open correct site pass case', function() {
    cy.get('h3').contains('Fun Chat').should('exist')
  });

  it('To verify open correct site pass case 1', function() {
    cy.get('h3').contains('Fun Chat').should('exist')
  });
})