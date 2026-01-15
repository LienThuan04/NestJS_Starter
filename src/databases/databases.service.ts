import { Role, RoleDocument } from "@/role/schema/role.schema";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ADMIN_ROLE, USER_ROLE } from "@/databases/sample";
import { User } from "@/user/schema/user.schema";
import { generatePasswordHash } from "@/lib/bcrypt";

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name); //in ra log khi khởi tạo module

    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly configService: ConfigService,

    ) { };

    private async initializeRoles() {
        const roles = [
            { name: ADMIN_ROLE, description: 'Administrator with full access' },
            { name: USER_ROLE, description: 'Regular user with limited access' },
        ];
        for (const roleData of roles) {
            const existingRole = await this.roleModel.findOne({ name: roleData.name }).exec();
            if (!existingRole) {
                const role = await this.roleModel.create(roleData);
                role ?
                this.logger.log(`Created role: ${roleData.name}`) :
                this.logger.error(`Failed to create role: ${roleData.name}`);
            }
        }
    }

    private async initializeUsers() {
        const roleAdmin: any = await this.roleModel.findOne({ name: ADMIN_ROLE }).exec();
        const userRole: any = await this.roleModel.findOne({ name: USER_ROLE }).exec();
        if (!roleAdmin || !userRole) {
            this.logger.error('Required roles are missing. Cannot initialize users.');
            return;
        }
        const users: Partial<User>[] = [
            { userName: 'admin', email: 'admin@example.com', password: this.configService.get<string>('DEFAULT_PASSWORD')!, roleId: roleAdmin._id },
            { userName: 'user', email: 'user@example.com',  password: this.configService.get<string>('DEFAULT_PASSWORD')!, roleId: userRole._id },
        ];
        for (const userData of users) {
            const existingUser = await this.userModel.findOne({ email: userData.email, userName: userData.userName }).exec();
            if (!existingUser) {
                const user = await this.userModel.create({
                    ...userData,
                    password: await generatePasswordHash(userData.password!, Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS')!)),
                });
                user ?
                this.logger.log(`Created user: ${userData.email}`) :
                this.logger.error(`Failed to create user: ${userData.email}`);
            }
        }
    }

    async onModuleInit() {
        if (this.configService.get<boolean>('INIT_DB')) {
            this.logger.log('Initializing database with default data...');
            await this.initializeRoles();
            await this.initializeUsers();
        }
    };
}
