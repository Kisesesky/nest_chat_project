import { PartialType } from '@nestjs/mapped-types';
import { RegisterUser } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterUser) {}
