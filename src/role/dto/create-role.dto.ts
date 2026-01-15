import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({ example: 'admin', description: 'The name of the role' })
    @IsNotEmpty({ message: 'Role name must not be empty' })
    @IsString({ message: 'Role name must be a string' })
    @MinLength(2, { message: 'Role name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Role name must be at most 50 characters long' })
    name: string;

    @ApiProperty({ example: 'Administrator role with full permissions', description: 'The description of the role', required: false })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MaxLength(200, { message: 'Description must be at most 200 characters long' })
    description?: string;
}
