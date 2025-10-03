import { IsString, IsOptional, IsInt, Min, IsNumber, IsBoolean, IsUrl } from 'class-validator';

export class CreateBookDto {
  @IsString() 
  title!: string;

  @IsString() 
  author!: string;

  @IsString() 
  publisher!: string;

  @IsOptional() 
  @IsInt() 
  @Min(0) 
  year?: number;

  @IsOptional() 
  @IsNumber({ maxDecimalPlaces: 2 }) 
  @Min(0) 
  price?: number;

  @IsString()
  genre!: string;

  @IsOptional()
  @IsBoolean() 
  available?: boolean;

  @IsOptional()
  @IsString()  
  coverurl?: string;
}