export class CreateCustomerDto {
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
}

export class UpdateCustomerDto {
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    password?: string;
}
