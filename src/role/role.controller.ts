import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { CreateRoleDto } from '@/role/dto/create-role.dto';
import { UpdateRoleDto } from '@/role/dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.roleService.create(createRoleDto);
      if (!newRole){
        return { message: 'Failed to create role' };
      }
      return { message: 'Role created successfully', data: newRole };
    } catch (error) {
      console.error('Error creating role:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const roles = await this.roleService.findAll();
      return { message: 'Roles retrieved successfully', data: roles };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const role = await this.roleService.findOne(id);
      return { message: 'Role retrieved successfully', data: role };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const updatedRole = await this.roleService.update(id, updateRoleDto);
      return { message: 'Role updated successfully', data: updatedRole };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.roleService.remove(id);
      return { message: 'Role deleted successfully', data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
