import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateUserDto {
    @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
    @IsNotEmpty({ message: 'Username must not be empty' })
    @IsString({ message: 'Username must be a string' })
    @MaxLength(30, { message: 'Username must be at most 30 characters long' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    userName: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'The email address of the user' })
    @IsNotEmpty({ message: 'Email must not be empty' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(100, { message: 'Email must be at most 100 characters long' })
    @MinLength(5, { message: 'Email must be at least 5 characters long' })
    @IsString({ message: 'Email must be a string' })
    email: string;

    @ApiProperty({ example: '123456', description: 'The password of the user' })
    @IsNotEmpty({ message: 'Password must not be empty' })
    @IsString({ message: 'Password must be a string' })
    @MaxLength(50, { message: 'Password must be at most 50 characters long' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({ example: 'USER', description: 'The role name assigned to the user' })
    @IsNotEmpty({ message: 'Role name must not be empty' })
    @IsString({ message: 'Role name must be a string' })
    @MaxLength(50, { message: 'Role name must be at most 50 characters long' })
    @MinLength(2, { message: 'Role name must be at least 2 characters long' })
    roleName: string;
}
