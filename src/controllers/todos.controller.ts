import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

export class TodosController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
  ) {}
  /**
   * Function to return todsos after every operation
   */
  getTodos = () => {
    return this.todoRepository.find();
  };
  /**
   *
   * @param todo
   * Create a to do
   */
  @post('/api/todos')
  @response(200, {
    description: 'Todo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodo',
          }),
        },
      },
    })
    todo: Todo,
  ): Promise<Todo> {
    let last_record = await this.todoRepository.findOne({order: ['id DESC']});
    if (last_record) todo.id = last_record.id + 1;
    console.info(todo);
    return this.todoRepository.create(todo);
  }
  /**
   *
   * @param where
   * Get the number of todos. Can take a param
   */
  @get('/api/todos/count')
  @response(200, {
    description: 'Todo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Todo) where?: Where<Todo>): Promise<Count> {
    return this.todoRepository.count(where);
  }
  /**
   *
   * @param filter
   * Get all todos
   */
  @get('/api/todos')
  @response(200, {
    description: 'Array of Todo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Todo) filter?: Filter<Todo>): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }
  /**
   *
   * @param todo
   * @param where
   *
   * Update todos
   */
  @patch('/api/todos')
  @response(200, {
    description: 'Todo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Todo[]> {
    await this.todoRepository.updateAll(todo, where);
    return this.getTodos();
  }

  /**
   *
   * @param id
   * @param filter
   * Get todo by id
   */
  @get('/api/todos/{id}')
  @response(200, {
    description: 'Todo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>,
  ): Promise<Todo> {
    return this.todoRepository.findById(id, filter);
  }

  /**
   *
   * @param id
   * @param todo
   */
  @patch('/api/todos/{id}')
  @response(204, {
    description: 'Todo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<Todo[]> {
    await this.todoRepository.updateById(id, todo);
    return this.getTodos();
  }

  /**
   *
   * @param id
   * @param todo
   */
  @put('/api/todos/{id}')
  @response(204, {
    description: 'Todo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<Todo[]> {
    await this.todoRepository.replaceById(id, todo);
    return this.getTodos();
  }

  /**
   *
   * @param id
   * Endpoint to delete each todo{takes id as param}
   */
  @del('/api/todos/{id}')
  @response(204, {
    description: 'Todo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<Todo[]> {
    await this.todoRepository.deleteById(id);
    return this.getTodos();
  }
}
