import { Module } from '@nestjs/common';
import { SessionService } from '@/session/session.service';
import { SessionController } from '@/session/session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '@/session/schema/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Session.name, schema: SessionSchema}
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
