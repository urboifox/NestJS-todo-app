import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(
        createUserDto: CreateUserDto,
    ): Promise<ResponseWrapper<{ id: string }>> {
        const exists = await this.userModel
            .findOne({
                email: createUserDto.email,
            })
            .exec();

        if (exists) {
            throw new BadRequestException('User already exists');
        }

        const hash = await bcrypt.hash(createUserDto.password, 10);

        const user = new this.userModel({
            ...createUserDto,
            password: hash,
        });
        await user.save();

        return {
            success: true,
            data: { id: user.id },
            statusCode: 201,
        };
    }

    async login(
        loginUserDto: LoginUserDto,
    ): Promise<ResponseWrapper<{ access_token: string; user: User }>> {
        const user = await this.userModel
            .findOne({ email: loginUserDto.email })
            .exec();

        if (!user) {
            throw new UnauthorizedException('Email or password is incorrect');
        }

        const match = await bcrypt.compare(
            loginUserDto.password,
            user.password,
        );

        if (!match) {
            throw new UnauthorizedException('Email or password is incorrect');
        }

        const access_token = await this.jwtService.signAsync({ sub: user.id });

        const filteredUser = user.toObject();
        filteredUser['id'] = user.id;
        delete filteredUser._id;
        delete filteredUser['__v'];
        delete filteredUser.password;

        return {
            success: true,
            data: {
                access_token,
                user: filteredUser,
            },
            statusCode: 200,
        };
    }

    async findAll(): Promise<ResponseWrapper<User[]>> {
        const total = await this.userModel.countDocuments().exec();
        const users = await this.userModel.find().exec();

        const filteredUsers = users.map((user) => {
            const newUser = user.toObject();
            newUser['id'] = user.id;
            delete newUser._id;
            delete newUser['__v'];
            delete newUser.password;
            return newUser;
        });

        return {
            success: true,
            data: filteredUsers,
            statusCode: 200,
            count: users.length,
            total,
        };
    }

    async findOne(id: string): Promise<ResponseWrapper<User>> {
        const user = await this.userModel.findById(id).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const filteredUser = user.toObject();
        filteredUser['id'] = user.id;
        delete filteredUser._id;
        delete filteredUser['__v'];
        delete filteredUser.password;

        return {
            success: true,
            data: filteredUser,
            statusCode: 200,
        };
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<ResponseWrapper<User>> {
        const user = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            success: true,
            data: user,
            statusCode: 200,
        };
    }

    remove(id: string) {
        const user = this.userModel.findByIdAndDelete(id).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
