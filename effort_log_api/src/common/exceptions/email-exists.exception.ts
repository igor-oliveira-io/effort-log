import { BadRequestException } from '@nestjs/common';

export class EmailExistsException extends BadRequestException {
  constructor() {
    super({
      message: ['Email is already in use'],
      error: 'Bad Request',
      statusCode: 400,
    });
  }
}
