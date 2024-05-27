import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Get()
    async getAll() {
        const todos = await this.todosService.getAll();
        return todos;
    }

    @Get(':id')
    async getOne(@Param('id') todoId: string) {
        const todo = await this.todosService.getOne(todoId);
        return todo;
    }

    @Post()
    async create(@Body(new ValidationPipe()) createTodoDto: CreateTodoDto) {
        const createdTodoId = this.todosService.create(createTodoDto);
        return createdTodoId;
    }

    @Patch(':id')
    async update(
        @Param('id') todoId: string,
        @Body(new ValidationPipe()) updateTodoDto: UpdateTodoDto,
    ) {
        const todo = await this.todosService.update(todoId, updateTodoDto);
        return todo;
    }

    @Delete()
    async remove(@Param('id') todoId: string) {
        const todo = await this.todosService.remove(todoId);
        return todo;
    }
}
