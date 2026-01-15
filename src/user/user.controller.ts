import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.userService.create(createUserDto);
      return { message: 'User created successfully', data: user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      if (!users || users.length === 0){
        return { message: 'No users found', data: [] };
      }
      return { message: 'Users retrieved successfully', data: users };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user){
        return { message: `User with ID ${id} not found`, data: null };
      }
      return { message: 'User retrieved successfully', data: user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      if (!updatedUser){
        return { message: `Failed to update user with ID ${id}` };
      }
      return { message: 'User updated successfully', data: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.userService.remove(id);
      if (!result){
        return { message: `Failed to delete user with ID ${id}` };
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
