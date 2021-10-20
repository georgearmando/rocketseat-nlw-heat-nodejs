import { prismaClient } from "../prisma"

/**
 * TO DO
 * - Recuperar as 3 últimas mensagens, ordenar por ordem crescente [*]
 * - Incluir os dados do usuário nas mensagens recuperadas [*]
 * - Retornar as mensagens [*]
 */
class GetLast3MessagesService {
  async execute() {
    // Recuperar as 3 últimas mensagens, ordenar por ordem crescente
    const messages = await prismaClient.message.findMany({
      take: 3,
      orderBy: {
        created_at: 'desc',
      },
      // Incluir os dados do usuário nas mensagens recuperadas
      include: {
        user: true,
      },
    });

    // Retornar as mensagens
    return messages;
  }
}

export { GetLast3MessagesService }