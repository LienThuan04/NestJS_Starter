import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { DatabasesModule } from './databases/databases.module';
import { SessionModule } from './session/session.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>("MONGODB_URI"),
        dbName: "ToDoList",
        connectionFactory: (connection) =>{
          return connection
        }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    RoleModule,
    DatabasesModule,
    SessionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
