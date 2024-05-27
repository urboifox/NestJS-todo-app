import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersGuard } from './users.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return await this.usersService.register(createUserDto);
    }

    @Post('login')
    async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
        return await this.usersService.login(loginUserDto);
    }

    @Get()
    async findAll() {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @UseGuards(UsersGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(id, updateUserDto);
    }

    @UseGuards(UsersGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.usersService.remove(id);
    }
}
