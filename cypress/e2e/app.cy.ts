describe('Main pages', () => {
  it('home page renders correctly', async () => {
    cy.visit('/')
  
    cy.get('[data-test-page-link]').should('not.be.empty')
    cy.get('[data-test-page-link]').should('have.attr', 'href')
    cy.get('[data-test-page-link]').first().click({force: true});
    cy.url().should('include', 'blog')

    cy.get('h2').should('exist')
  })
  
  it('Series page renders correctly', () => {
    cy.visit('http://localhost:3000/series/source-code-gen-flutter')

    cy.get('h1').should('contain.text', 'Blogs Series: Source code generation in Flutter & Dart')

    cy.get('[data-test-page-link]').should('not.be.empty')
    cy.get('[data-test-page-link]').should('have.attr', 'href')
    cy.get('[data-test-page-link]').first().click({force: true});
    cy.url().should('include', 'blog')

    cy.get('h2').should('exist')
    cy.get('.blog-series-list').should('exist').and('not.be.empty').and('contain.text', 'Code-gen in Dart & Flutter: How to create a builder to generate SQL code')
  })
})