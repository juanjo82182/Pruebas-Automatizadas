import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: true, 
});

// Interface para el cuerpo de la solicitud
interface ApiBody {
  nombre: string;
  descripcion?: string;
  endpoint: string;
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  parametros?: object;
  headers?: object;
  auth?: string;
}

// Crear una API
fastify.post<{ Body: ApiBody }>('/apis', async (request, reply) => {
  const data = request.body;
  const api = await prisma.apis.create({ data });
  reply.send(api);
});

// Leer todas las APIs
fastify.get('/apis', async (request, reply) => {
  const apis = await prisma.apis.findMany();
  reply.send(apis);
});

// Leer una API por ID
fastify.get<{ Params: { id: string } }>('/apis/:id', async (request, reply) => {
  const { id } = request.params;
  const api = await prisma.apis.findUnique({ where: { id } });
  reply.send(api || { error: 'API not found' });
});

// Actualizar una API
fastify.put<{ Params: { id: string }; Body: ApiBody }>('/apis/:id', async (request, reply) => {
  const { id } = request.params;
  const data = request.body;
  const api = await prisma.apis.update({
    where: { id },
    data: { ...data, actualizado_en: new Date() },
  });
  reply.send(api);
});

// Eliminar una API
fastify.delete<{ Params: { id: string } }>('/apis/:id', async (request, reply) => {
  const { id } = request.params;
  await prisma.apis.delete({ where: { id } });
  reply.send({ message: `API ${id} deleted` });
});

// Iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();