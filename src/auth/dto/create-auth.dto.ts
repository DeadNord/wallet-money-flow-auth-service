import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
class CreateAuthDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'wallet',
    default: '1md198247nms18941',
  })
  @IsNotEmpty()
  @IsString()
  wallet: string;

  // @ApiProperty({
  //   type: String,
  //   required: true,
  //   description: 'pass',
  //   default: '123456789',
  // })
  // @IsNotEmpty()
  // @IsString()
  // password: string;
}

export { CreateAuthDto };
