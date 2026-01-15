import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateSessionDto {
    @ApiProperty({ example: 'user123', description: 'The ID of the user associated with the session' })
    @IsNotEmpty({ message: 'User ID must not be empty' })
    @IsMongoId({ message: 'User ID must be a valid MongoDB ObjectId' })
    userId: Types.ObjectId;

    @ApiProperty({ example: 'abcdef123456', description: 'The session token' })
    @IsNotEmpty({ message: 'Refresh token must not be empty' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;

}
