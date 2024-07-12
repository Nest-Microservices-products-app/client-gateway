import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {

  const logger = new Logger('Main-Gateway')

  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes( new ValidationPipe({
    whitelist : true,
    forbidNonWhitelisted : true
  }))

  app.setGlobalPrefix('api', {
    exclude : [
      {
        path : '',
        method : RequestMethod.GET
      }
    ]
  });

  app.useGlobalFilters( new RpcCustomExceptionFilter() )

  await app.listen(envs.port);


  console.log('HealthCheck configured')

  logger.log(`Gateway running on port ${envs.port}`);
}
bootstrap();
