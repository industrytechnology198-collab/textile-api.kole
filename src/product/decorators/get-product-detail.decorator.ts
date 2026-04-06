import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';

export function GetProductDetail() {
  return applyDecorators(
    ApiTags('Product'),
    ApiOperation({
      summary:
        'Find a single product by catalog reference detailing all variables',
    }),
    ApiParam({
      name: 'catalogReference',
      required: true,
      description: 'e.g. B050',
    }),
    ApiResponse({
      status: 200,
      description: 'Product successfully retrieved.',
    }),
    ApiResponse({
      status: 404,
      description: 'Product could not be localized.',
    }),
  );
}
