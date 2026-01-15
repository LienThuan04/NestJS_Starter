import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { generatePasswordHash } from '@/lib/bcrypt';
import { RoleService } from '../role/role.service';
import { ConfigService } from '@nestjs/config';
import { USER_ROLE } from '@/databases/sample';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly roleService: RoleService,
    private readonly ConfigService: ConfigService,
  ) {}

  async CheckUserExists(userName: string, email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ $or: [ { userName: userName }, { email: email } ] }).exec();
    return !!user;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const user = await this.userModel.findOne({ $or: [ { userName: usernameOrEmail }, { email: usernameOrEmail } ] }).exec();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if(await this.CheckUserExists(createUserDto.userName, createUserDto.email)){
      throw new Error('User with given username or email already exists');
    }
    const role: any = await this.roleService.FindRoleByName(createUserDto.roleName || USER_ROLE);
    if (!role){
      throw new Error('Default role not found');
    }
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: await generatePasswordHash(createUserDto.password, Number(this.ConfigService.get('BCRYPT_SALT_ROUNDS'))),
      roleId: role?._id,
    });
    if (!newUser){
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (!users || users.length === 0){
      throw new Error('No users found');
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user){
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const role: any = updateUserDto.roleName ? await this.roleService.FindRoleByName(updateUserDto.roleName) : null;
    if (updateUserDto.roleName && !role){
      throw new Error('Role not found for the given role name');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, { ...updateUserDto, roleId: role?._id }, { new: true }).exec();
    if (!updatedUser){
      throw new Error(`Failed to update user with ID ${id}`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<boolean> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser){
      throw new Error(`Failed to delete user with ID ${id}`);
    }
    return true;
  }
}
