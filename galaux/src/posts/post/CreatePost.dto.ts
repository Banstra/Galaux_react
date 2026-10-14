// create-post.dto.ts
import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsOptional()
  server_id?: number;


}

