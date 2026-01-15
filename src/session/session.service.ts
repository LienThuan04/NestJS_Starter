import { Injectable, Delete } from '@nestjs/common';
import { CreateSessionDto } from '@/session/dto/create-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from './schema/session.schema';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,

  ) { }


  async UpSertSessionAsync(createSessionDto: CreateSessionDto): Promise<Session | null> {
    const filter = { userId: createSessionDto.userId };
    const ExpiresAt: Date = new Date(Date.now() + ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))!); // Set expiration to 7 days from now
    const update: Partial<Session> = { ...createSessionDto, expiresAt: ExpiresAt };
    const options = {
      upsert: true, // Create the document if it doesn't exist
      new: true, // Return the updated document new
      setDefaultsOnInsert: true, // Apply default values if a new document is created

    };
    const session = await this.sessionModel.findOneAndUpdate(filter, update, options).exec();
    if (!session) {
      throw new Error('Failed to upsert session');
    }
    return session;
  }

  async findSessionByRefreshTokenAndUserId(refreshToken: string): Promise<Session | null> {
    const session = await this.sessionModel
      .findOne({ refreshToken: refreshToken })
      .exec();
    return session;
  }

  async DeleteSessionByUserId(userId: string): Promise<boolean> {
    const objectId = new Types.ObjectId(userId);
    const result = await this.sessionModel
      .findOneAndDelete({ userId: objectId })
      .exec();
    if (!result) {
      throw new Error(`Failed to delete session for user ID ${userId}`);
    }

    return true;
  }
}
