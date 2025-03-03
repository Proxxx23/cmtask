import {Customer, Location} from '../../src/domain/customer/entity/Customer';

export const createCustomer = (
    first_name = 'John',
    last_name = 'Doe',
    email = 'jogndoe@gmail.com',
    location: Location = 'Oceania',
): Customer => {
    const customer = new Customer();
    customer.firstName = first_name;
    customer.lastName = last_name;
    customer.email = email;
    customer.location = location;
    customer.createdAt = new Date();
    customer.updatedAt = new Date();

    return customer;
}
