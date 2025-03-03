import {
    PriceCalculator,
    SEASONAL_DISCOUNT_CATEGORIES,
} from '../../../../src/domain/order/PriceCalculator';
import {createCustomer} from '../../../fixtures/Customer';
import {createProduct} from '../../../fixtures/Product';

// fixme: !!! This test needs modification as it can fail on Christmas Eve, BlackFriday etc.!!!
// fixme: For task purposes I've made it as simple as possible, but in real world we should mock the Date
describe('Price Calculator Test', () => {
    let priceCalculator: PriceCalculator;

    beforeEach(() => {
        priceCalculator = new PriceCalculator();
    });

    it('should calculate price that remains the same if no discounts should be applied', () => {
        const fullProductPrice = 100;
        const customer = createCustomer();
        const product = createProduct('Product 1', 'Product 1 description', fullProductPrice, 10, 'foobar');

        const finalPrice = priceCalculator.calculatePrice(customer, product, 1);

        expect(finalPrice).toBe(fullProductPrice);
    })

    it('should calculate price with VAT and the highest discount for European customer', () => {
        const fullProductPrice = 100;
        const quantity = 2;
        const customer = createCustomer('John', 'Doe', 'johndoe@gmail.com', 'Europe');
        const product = createProduct('Product 1', 'Product 1 description', fullProductPrice, 10, 'electronics');

        jest.spyOn(priceCalculator as any, 'getHighestPossibleDiscount').mockReturnValue(0.25);

        const finalPrice = priceCalculator.calculatePrice(customer, product, quantity);

        // fullProductPrice * (1 - 0.25) * quantity * VAT_INCLUDED_RATIO;
        const expectedPrice = 172.5;
        expect(finalPrice).toBe(expectedPrice);
    });

    it('should calculate price without VAT and the highest discount for Oceania customer', () => {
        const fullProductPrice = 100;
        const quantity = 2;
        const customer = createCustomer('John', 'Doe', 'johndoe@gmail.com', 'Oceania');
        const product = createProduct('Product 1', 'Product 1 description', fullProductPrice, 10, 'electronics');

        jest.spyOn(priceCalculator as any, 'getHighestPossibleDiscount').mockReturnValue(0.25);

        const finalPrice = priceCalculator.calculatePrice(customer, product, quantity);

        // fullProductPrice * (1 - 0.25) * quantity;
        const expectedPrice = 150;
        expect(finalPrice).toBe(expectedPrice);
    });

    it('should calculate price with a VAT and no discount for European customer', () => {
        const fullProductPrice = 100;
        const quantity = 2;
        const customer = createCustomer('John', 'Doe', 'johndoe@gmail.com', 'Europe');
        const product = createProduct('Product 1', 'Product 1 description', fullProductPrice, 10, 'foobarbaz');

        const finalPrice = priceCalculator.calculatePrice(customer, product, quantity);

        // fullProductPrice * quantity * VAT_INCLUDED_RATIO;
        const expectedPrice = 230;
        expect(finalPrice).toBe(expectedPrice);
    });

    it('should calculate price with a VAT and category-eligible discount for European customer', () => {
        const fullProductPrice = 100;
        const quantity = 2;
        const customer = createCustomer('John', 'Doe', 'johndoe@gmail.com', 'Europe');
        const product = createProduct('Product 1', 'Product 1 description', fullProductPrice, 10, SEASONAL_DISCOUNT_CATEGORIES[0]);

        jest.spyOn(priceCalculator as any, 'isChristmasEveToday').mockReturnValue(true);

        const finalPrice = priceCalculator.calculatePrice(customer, product, quantity);

        // fullProductPrice * (1 - 0.15) * quantity * VAT_INCLUDED_RATIO;
        const expectedPrice = 195.5;
        expect(finalPrice).toBe(expectedPrice);
    });

    it('should calculate price without VAT and location-based discount for Asian customer', () => {
        const fullProductPrice = 100;
        const quantity = 2;
        const customer = createCustomer('John', 'Doe', 'johndoe@gmail.com', 'Asia');
        const product = createProduct('Product 1', 'Product 1 description', fullProductPrice, 10, 'foobar');

        const finalPrice = priceCalculator.calculatePrice(customer, product, quantity);

        // fullProductPrice * (1 - 0.05) * quantity;
        const expectedPrice = 190;
        expect(finalPrice).toBe(expectedPrice);
    });
});
