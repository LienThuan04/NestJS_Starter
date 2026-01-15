import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength,  } from "class-validator"

export class AuthRequestDto {
    @ApiProperty({ example: 'user', description: 'The username or email of the user' })
    @IsNotEmpty({ message: 'Username or email must not be empty' })
    @IsString({ message: 'Username or email must be a string' })
    @MaxLength(100, { message: 'Username or email must be at most 100 characters long' })
    @MinLength(3, { message: 'Username or email must be at least 3 characters long' })
    username: string

    @ApiProperty({ example: '123456', description: 'The password of the user' })
    @IsNotEmpty({ message: 'Password must not be empty' })
    @IsString({ message: 'Password must be a string' })
    @MaxLength(50, { message: 'Password must be at most 50 characters long' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string
}