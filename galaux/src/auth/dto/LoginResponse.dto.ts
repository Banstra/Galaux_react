import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'testUser123' })
    username: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
    access_token: string;
}