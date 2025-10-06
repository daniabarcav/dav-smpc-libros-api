import { IsString, IsOptional, IsInt, Min, IsNumber, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookDto {
  @IsString() 
  title!: string;

  @IsString() 
  author!: string;

  @IsString() 
  publisher!: string;

  @IsOptional() 
  @Type(() => Number)
  @IsInt() 
  @Min(0) 
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }) 
  @Min(0) 
  price?: number;

  @IsString()
  genre!: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean() 
  available?: boolean;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}