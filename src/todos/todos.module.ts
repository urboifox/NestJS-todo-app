import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodosController } from './todos.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    ],
    controllers: [TodosController],
    providers: [TodosService],
})
export class TodosModule {}
