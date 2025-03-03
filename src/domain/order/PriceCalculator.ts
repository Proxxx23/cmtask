import {addDays, addWeeks, isSameDay, startOfMonth} from 'date-fns';
import {Product} from '../product/entity/Product';
import {Customer} from '../customer/entity/Customer';

export const SEASONAL_DISCOUNT_CATEGORIES = ['electronics', 'books'];

export const VAT_INCLUDED_RATIO = 1.15;

export class PriceCalculator {
    public calculatePrice(customer: Customer, product: Product, quantity: number): number {
        const discountRate = this.getHighestPossibleDiscount(customer, product);

        let finalPrice = product.getPrice() * (1 - discountRate) * quantity;

        return parseFloat(this.calculateVAT(customer.location, finalPrice).toFixed(2));
    }

    private calculateVAT(customerLocation: Customer['location'], price: number): number {
        return customerLocation === 'Europe'
            ? price * VAT_INCLUDED_RATIO
            : price;
    }

    private getHighestPossibleDiscount(customer: Customer, product: Product): number {
        const possibleDiscounts = [
            this.checkBlackFridayDiscount(),
            this.checkSeasonalDiscountInCategories(product),
            this.checkLocationBasedDiscount(customer)
        ];

        return Math.max(...possibleDiscounts);
    }

    private checkSeasonalDiscountInCategories(product: Product): number {
        const isSpecialDayToday = this.isChristmasEveToday() || this.isLabourDayToday();
        if (!isSpecialDayToday) {
            return 0;
        }

        const hasEligibleCategory = SEASONAL_DISCOUNT_CATEGORIES.includes(product.productCategory.name);

        return hasEligibleCategory ? 0.15 : 0;
    }

    private checkLocationBasedDiscount(customer: Customer): number {
        switch (customer.location) {
            case 'Asia':
                return 0.05;
            default:
                return 0;
        }
    }

    private checkBlackFridayDiscount(): number {
        const now = new Date();
        const firstDayOfNovember = startOfMonth(new Date(now.getFullYear(), 10));
        const blackFriday = addDays(addWeeks(firstDayOfNovember, 3), 5);

        return isSameDay(now, blackFriday) ? 0.25 : 0;
    }

    private isChristmasEveToday(): boolean {
        const now = new Date();
        const christmasEve = new Date(now.getFullYear(), 11, 24);

        return isSameDay(now, christmasEve);
    }

    private isLabourDayToday(): boolean {
        const now = new Date();
        const labourDay = new Date(now.getFullYear(), 4, 1);

        return isSameDay(now, labourDay);
    }
}
