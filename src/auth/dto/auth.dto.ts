import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty({ message: 'This field is required!' })
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'This field is required!' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'This field is required!' })
  password!: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'This field is required!' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'This field is required!' })
  password!: string;
}
