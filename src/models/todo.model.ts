import {Entity, model, property} from '@loopback/repository';

@model()
export class Todo extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  text: string;

  @property({
    type: 'boolean',
    required: true,
  })
  done: boolean;

  @property({
    type: 'number',
    id: true,
    default: 1,
    generated: false,
  })
  id: number;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
