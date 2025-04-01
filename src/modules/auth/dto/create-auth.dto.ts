import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsStrongPassword, IsString } from "class-validator"


export class RegisterUser {
    @ApiProperty({ type: String, default: 'test@tset.com' })
    @IsEmail()
    email: string

    @ApiProperty({ type: String, default: 'Test1234!' })
    @IsStrongPassword({
        minLength: 1,
        minUppercase: 1,
        minLowercase: 1, 
        minSymbols: 1
    })
    password: string

    @ApiProperty({ type: String, default: 'tester' })
    @IsString()
    name: string
}
