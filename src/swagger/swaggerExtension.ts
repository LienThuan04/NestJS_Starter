import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//config swagger
export default class ConfigSwagger {
    public static setup = (app: NestExpressApplication): void => {
        const config = new DocumentBuilder()
            .setTitle('ToDoList API')
            .setDescription('The ToDoList API description')
            .setVersion('1.0')
            .addBearerAuth({
                type: 'http',
                scheme: 'Bearer',
                bearerFormat: 'JWT',
                in: 'header',
            }, 'access-token')
            .addSecurityRequirements('access-token')
            .build();
        const documentFactory = () => SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, documentFactory, { //route swagger http://localhost:3000/swagger
            swaggerOptions: {
                persistAuthorization: true, //keep authorization token after refresh page and f5
            },
        });
    }
}