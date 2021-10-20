import axios from "axios";
import { Secret, sign } from "jsonwebtoken";

import { prismaClient } from '../prisma';

/**
 * TO DO
 * - Receber um code(string) [*]
 * - Recuperar o access_token no github [*]
 * - Recuperar infos do user no github [*]
 * - Verificar se o usuário existe no DB [*]
 * -- Se SIM = Gerar um token [*]
 * -- Se Não = Criar o usuário e gerar um token [*]
 * - Retornar o token com as infos do usuário [*]
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    // Recuperar o access token no github
    const url = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    // Recuperar infos do user no github
    const response = await axios.get<IUserResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`,
      }
    });

    // Verificar se o usuário existe no DB
    const { avatar_url, id, login, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          avatar_url,
          github_id: id,
          login,
          name,
        }
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      `${process.env.JWT_SECRET}`,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    return { token, user }
  }
}

export { AuthenticateUserService }