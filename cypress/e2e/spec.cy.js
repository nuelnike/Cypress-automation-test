describe('Automation Exercise Test', () => {
  it('Verify navigation to Automation Exercise and cart functionality', () => {
    
    // 1. Visit the Automation Exercise website
    cy.visit('https://www.automationexercise.com/')

    // Verify the URL
    cy.url().should('eq', 'https://www.automationexercise.com/')

    // 2.0 The user clicks on the “Cart” icon from the header.
    cy.get('.shop-menu.pull-right').find('a[href="/view_cart"]').click();  
    cy.url().should('eq', 'https://www.automationexercise.com/view_cart');

    //2.1 The user verifies that shopping cart empty at that moment.
    cy.get('.text-center').should('contain', 'Cart is empty!');

    // 3.0 The user clicks on the &quot;Products&quot; button from header.
    cy.get('.shop-menu.pull-right').find('a[href="/products"]').click();  
    cy.url().should('eq', 'https://www.automationexercise.com/products');

    // 3.1 The user filters by clicking on the T-shirt option under the Men category.
    cy.get('a[href="/category_products/3"]').should('contain', 'Tshirts');

    // 3.2 The user adds random 3 products to the cart from this page.
    const ItrateAddToCartFunc = (n) => {
      //click on add to cart button
      cy.get(`div.productinfo a[data-product-id="${n}"]`).click();
      // The user confirms that the product has been added to the cart with the pop-up that appears.
      cy.get('.modal-content').should('contain', 'Your product has been added to cart.')
      
      //close modal if add action is not the 3rd product
      if(n<3) cy.get('.btn.btn-success.close-modal.btn-block').click(); 
      else {
        // Click View Cart button in pop-up
        cy.get('p.text-center').find('a[href="/view_cart"]').click();
        // Verify cart page redirection
        cy.url().should('eq', 'https://www.automationexercise.com/view_cart');
      }
    }

    for (let i = 0; i < 3; i++) ItrateAddToCartFunc(i+1);

    // Verify items in cart and total price
    cy.get('#cart_info_table tbody tr').should('not.have.length', 0);

    let cartTotal = 0;
    let itemCost = 0;

    cy.get('#cart_info_table tbody tr').each(($row) => {
        // Get quantity and price from the current row
        const quantity = parseInt($row.find('.cart_quantity button').text());
        const price = parseInt($row.find('.cart_price p').text().replace('Rs. ', ''));
    
        // Get total from the current row
        const total = parseInt($row.find('.cart_total p').text().replace('Rs. ', ''));
    
        // Confirm that the total amount equals per item quantity * per item price
        itemCost += quantity * price; // total cost per item.
        cartTotal += total // total cart amount

    }).then(() => {
      // Assert to check if correct
      expect(cartTotal).to.equal(itemCost);
    });

  })
});