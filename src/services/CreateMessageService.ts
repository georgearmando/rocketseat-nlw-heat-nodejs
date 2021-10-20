import { io } from "../app";
import { prismaClient } from "../prisma"

/**
 * TO DO
 * - Receber uma mensagem(string) e o user [*]
 * - Cria a mensagem e salva no DB [*]
 * - Emitir a mensagem para o WebSocket [*]
 * - Incluir os dados do user no retorno da criação da mensagem [*]
 * - Retornar a mensagem [*]
 */
class CreateMessageService {
  async execute(text: string, user_id: string) {
    // Cria a message e salva no DB
    const message = await prismaClient.message.create({
      data: {
        text,
        user_id,
      },
      // Incluir os dados do user no retorno
      include: {
        user: true,
      }
    });

    // Emitir a mensagem para o WebSocket
    const infoWS = {
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    io.emit('new_message', infoWS);

    // Retornar a mensagem
    return message;
  }
}

export { CreateMessageService }