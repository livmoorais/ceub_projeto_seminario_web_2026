import { ApiErro } from "./cliente";

/**
 * Contas (Módulo 01, Req. 001). Contrato previsto na arquitetura: o backend responde com um JWT de
 * curta duração e grava o refresh token em cookie httpOnly; a senha nunca volta na resposta.
 * Enquanto o backend de contas não existir, a API devolve 404 e a tela mostra isso, sem simular login.
 */
export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
}

export class ContaErro extends Error {}

/** Chamada na mesma origem (/api → backend, ver next.config.ts), com o cookie de sessão. */
async function postar<T>(caminho: string, corpo: unknown): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new ApiErro(resposta.status, caminho);
  return (await resposta.json()) as T;
}

function traduzir(erro: unknown, modo: "entrar" | "cadastro"): ContaErro {
  if (erro instanceof ApiErro) {
    if (erro.status === 404 || erro.status === 501) {
      return new ContaErro(
        "o login e o cadastro ainda não estão disponíveis: o serviço de contas do backend está em desenvolvimento. nenhum dado foi salvo.",
      );
    }
    // mensagem genérica de propósito: não revela se o e-mail existe (Req. 001)
    if (erro.status === 401) return new ContaErro("e-mail ou senha incorretos.");
    if (erro.status === 409) return new ContaErro("já existe uma conta com esse e-mail. tente entrar.");
    if (erro.status === 429) return new ContaErro("muitas tentativas seguidas. espere alguns minutos e tente de novo.");
    if (erro.status === 400 || erro.status === 422) return new ContaErro("confira os dados do formulário e tente de novo.");
  }
  return new ContaErro(
    modo === "entrar"
      ? "não conseguimos falar com o servidor agora. verifique sua conexão e tente de novo."
      : "não conseguimos criar sua conta agora. verifique sua conexão e tente de novo.",
  );
}

export async function entrar(email: string, senha: string): Promise<UsuarioLogado> {
  try {
    return await postar<UsuarioLogado>("/auth/login", { email, senha });
  } catch (erro) {
    throw traduzir(erro, "entrar");
  }
}

export async function cadastrar(nome: string, email: string, senha: string): Promise<UsuarioLogado> {
  try {
    return await postar<UsuarioLogado>("/auth/cadastro", { nome, email, senha });
  } catch (erro) {
    throw traduzir(erro, "cadastro");
  }
}
