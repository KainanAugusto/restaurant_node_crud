import { IsEmail, IsNotEmpty, IsString, MinLength, isNotEmpty, isString } from 'class-validator';
import { Timestamp } from 'rxjs';

export class CreateUserDTO{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
    
    @IsNotEmpty()
    @IsString()
    role: string;

}