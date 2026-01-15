import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '@/role/dto/create-role.dto';
import { UpdateRoleDto } from '@/role/dto/update-role.dto';
import { Role, RoleDocument } from './schema/role.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async CheckRoleExists(roleName: string): Promise<boolean> {
    const role = await this.roleModel.findOne({ name: roleName }).exec();
    return !!role;
  }

  async FindRoleByName(roleName: string): Promise<Role | null> {
    const role = await this.roleModel.findOne({ name: roleName }).exec();
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    if(await this.CheckRoleExists(createRoleDto.name)){
      throw new Error('Role already exists');
    }
    const newRole = await this.roleModel.create(createRoleDto);
    if (!newRole){
      throw new Error('Failed to create role');
    }
    return newRole;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.roleModel.find().exec();
    if (!roles || roles.length === 0){
      throw new Error('No roles found');
    }
    return roles;
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role){
      throw new Error(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updatedRole = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
    if (!updatedRole){
      throw new Error(`Failed to update role with ID ${id}`);
    }
    return updatedRole;
  }

  async remove(id: string): Promise<boolean> {
    const deletedRole = await this.roleModel.findByIdAndDelete(id).exec();
    if (!deletedRole){
      throw new Error(`Failed to delete role with ID ${id}`);
    }
    return deletedRole !== null; // Trả về true nếu xóa thành công ngược lại false khi không tìm thấy
  }
}
