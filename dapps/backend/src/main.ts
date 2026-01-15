import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Simple Storage DApp API')
    .setDescription(`
      -------------------------------------------------
      Rahmat Eka Satria
      231011402890
      -------------------------------------------------
      API documentation for the Simple Storage DApp backend
    `)
    .setVersion('1.0')
    .addTag('blockchain')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentations', app, document);

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`
    Server berjalan di: http://localhost:3000
    Swagger UI: http://localhost:3000/documentations
  `);
}
bootstrap().catch((err) => {
  console.error('Gagal menjalankan aplikasi', err);
  process.exit(1);
});