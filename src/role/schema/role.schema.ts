import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RoleDocument = HydratedDocument<Role>;

@Schema({timestamps: true})
export class Role {
    @Prop({required: true, trim: true, unique: true, type: String, uppercase: true})
    name: string;
    @Prop({type: String, default: null})
    description: string | null;
}

export const RoleSchema = SchemaFactory.createForClass(Role);