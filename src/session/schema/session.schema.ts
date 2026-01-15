import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type SessionDocument = HydratedDocument<Session>;

@Schema({timestamps: true})
export class Session {
    @Prop({required: true, trim: true, unique: true, type: mongoose.Types.ObjectId, ref: 'User'})
    userId: mongoose.Types.ObjectId;

    @Prop({required: true, trim: true, unique: true, type: String})
    refreshToken: string;

    @Prop({required: true, type: Date, expires: 0}) // expire after the date in expiresAt
    expiresAt: Date;

}
export const SessionSchema = SchemaFactory.createForClass(Session);