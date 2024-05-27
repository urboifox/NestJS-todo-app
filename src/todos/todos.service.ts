import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodosService {
    constructor(
        @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
    ) {}

    async getAll(): Promise<ResponseWrapper<Todo[]>> {
        const total = await this.todoModel.countDocuments().exec();
        const todos = await this.todoModel.find().exec();

        const filteredTodos = todos.map((todo) => {
            const newTodo = todo.toObject();
            newTodo['id'] = todo.id;
            delete newTodo._id;
            delete newTodo['__v'];
            return newTodo;
        });

        return {
            success: true,
            data: filteredTodos,
            statusCode: 200,
            count: todos.length,
            total,
        };
    }

    async getOne(id: string): Promise<ResponseWrapper<Todo>> {
        const todo = await this.todoModel.findById(id).exec();

        if (!todo) {
            throw new NotFoundException();
        }

        const filteredTodo = todo.toObject();
        filteredTodo['id'] = todo.id;
        delete filteredTodo._id;
        delete filteredTodo['__v'];

        return {
            success: true,
            data: filteredTodo,
            statusCode: 200,
        };
    }

    async create(
        createTodoDto: CreateTodoDto,
    ): Promise<ResponseWrapper<{ id: string }>> {
        const createdTodo = new this.todoModel(createTodoDto);
        await createdTodo.save();

        return {
            success: true,
            data: { id: createdTodo.id },
            statusCode: 201,
        };
    }

    async update(
        id: string,
        updateTodoDto: UpdateTodoDto,
    ): Promise<ResponseWrapper<Todo>> {
        const todo = await this.todoModel
            .findByIdAndUpdate(id, updateTodoDto, { new: true })
            .exec();

        if (!todo) {
            throw new NotFoundException();
        }

        return {
            success: true,
            data: todo,
            statusCode: 200,
        };
    }

    async remove(id: string): Promise<ResponseWrapper<Todo>> {
        const todo = await this.todoModel.findByIdAndDelete(id).exec();

        if (!todo) {
            throw new NotFoundException();
        }

        return {
            success: true,
            data: todo,
            statusCode: 200,
        };
    }
}
