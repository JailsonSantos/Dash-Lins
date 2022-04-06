import { ActiveModelSerializer, createServer, Factory, Model, Response } from 'miragejs'
import faker from 'faker';

type User = {
  name: string;
  email: string;
  createdAt: string;
};

export function makeServer() {
  const server = createServer({

    serializers: {
      application: ActiveModelSerializer
    },

    models: {
      user: Model.extend<Partial<User>>({})
    },

    // Criar uma lista de usuários fake, ex; 200 usuários
    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        created_at() {
          return faker.date.recent(10);
        },
      })
    },

    seeds(server) {
      server.createList('user', 200)
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams

        // Total de usuarios
        const total = schema.all('user').length

        // Calculo de inicio e fim de cada pagina
        const pageStart = (Number(page) - 1) * Number(per_page)
        const pageEnd = pageStart + Number(per_page)

        const users = this.serialize(schema.all('user')).users.slice(pageStart, pageEnd)

        return new Response(
          200,
          { 'x-total-count': String(total) },
          { users }
        )
      });

      this.get('/users/:id')
      this.post('/users');

      this.namespace = '';
      this.passthrough();
    }
  })

  return server;
}