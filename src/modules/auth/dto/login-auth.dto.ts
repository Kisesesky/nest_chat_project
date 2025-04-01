import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ type: String, default: 'test@test.com' })
    @IsEmail()
    email: string

    @ApiProperty({ type: String, default: 'Test1234!' })
    @IsString()
    password: string
}