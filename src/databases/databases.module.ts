import { Module } from '@nestjs/common';
import { DatabasesController } from '@/databases/databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@/role/schema/role.schema';
import { DatabasesService } from '@/databases/databases.service';
import { RoleService } from '@/role/role.service';
import { User, UserSchema } from '@/user/schema/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema},
      { name: User.name, schema: UserSchema }, // Assuming User schema is defined elsewhere
    ]),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService, RoleService],
})
export class DatabasesModule { }