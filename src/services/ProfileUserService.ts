import { prismaClient } from "../prisma"

/**
 * TO DO
 * - Recuperar os dados do usuário [*]
 * - Retornar o usuário [*]
 */
class ProfileUserService {
  async execute(user_id: string) {
    // Recuperar os dados do usuário
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });

    // Retornar o usuário
    return user;
  }
}

export { ProfileUserService }