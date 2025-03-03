import {Customer} from '../../../domain/customer/entity/Customer';

export class CustomerDTO {
    private constructor(
        public readonly uuid: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly location: string,
    ) { }

    public static fromEntity(customer: Customer): CustomerDTO {
        return new CustomerDTO(
            customer.uuid,
            customer.firstName,
            customer.lastName,
            customer.email,
            customer.location
        );
    }
}
