import { ApiErro } from "./cliente";

/**
 * Contas (Módulo 01, Req. 001), servidas pelo serviço de contas do backend (backend/contas).
 * O backend devolve um JWT curto (guardado só na memória) e grava o refresh token num cookie
 * httpOnly; a senha nunca volta na resposta.
 */
export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
}

export interface Sessao {
  usuario: UsuarioLogado;
  accessToken: string;
  expiraEm: string;
}

export class ContaErro extends Error {
  constructor(
    mensagem: string,
    public status?: number,
  ) {
    super(mensagem);
  }
}

/** Chamada na mesma origem (/api → serviço de contas, ver next.config.ts), com o cookie de sessão. */
async function postar<T>(caminho: string, corpo?: unknown): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    method: "POST",
    credentials: "same-origin",
    headers: corpo === undefined ? undefined : { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    const erro = new ApiErro(resposta.status, caminho);
    // o backend responde { erro, campos? } com a mensagem já pronta para mostrar
    const corpoErro = await resposta.json().catch(() => null);
    (erro as ApiErro & { detalhe?: string }).detalhe =
      corpoErro?.campos ? Object.values(corpoErro.campos as Record<string, string>)[0] : corpoErro?.erro;
    throw erro;
  }
  return (resposta.status === 204 ? null : await resposta.json()) as T;
}

function traduzir(erro: unknown, modo: "entrar" | "cadastro" | "sessao"): ContaErro {
  if (erro instanceof ApiErro) {
    const detalhe = (erro as ApiErro & { detalhe?: string }).detalhe;
    if (erro.status === 404 || erro.status === 501) {
      return new ContaErro("o serviço de contas não respondeu. confira se o backend está rodando (npm run dev).", erro.status);
    }
    // mensagem genérica de propósito: não revela se o e-mail existe (Req. 001)
    if (erro.status === 401) return new ContaErro(modo === "sessao" ? "sua sessão expirou." : "e-mail ou senha incorretos.", 401);
    if (erro.status === 409) return new ContaErro("já existe uma conta com esse e-mail. tente entrar.", 409);
    if (erro.status === 429) return new ContaErro("muitas tentativas seguidas. espere alguns minutos e tente de novo.", 429);
    if (erro.status === 400 || erro.status === 422) return new ContaErro(detalhe ?? "confira os dados do formulário e tente de novo.", erro.status);
    if (erro.status >= 500) return new ContaErro("o serviço de contas está fora do ar agora. tente de novo em instantes.", erro.status);
  }
  return new ContaErro(
    modo === "cadastro"
      ? "não conseguimos criar sua conta agora. verifique sua conexão e tente de novo."
      : "não conseguimos falar com o servidor agora. verifique sua conexão e tente de novo.",
  );
}

async function chamar<T>(modo: "entrar" | "cadastro" | "sessao", fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (erro) {
    throw traduzir(erro, modo);
  }
}

export const entrar = (email: string, senha: string) => chamar("entrar", () => postar<Sessao>("/auth/login", { email, senha }));

export const cadastrar = (nome: string, email: string, senha: string) =>
  chamar("cadastro", () => postar<Sessao>("/auth/cadastro", { nome, email, senha }));

/** Recupera a sessão pelo cookie httpOnly (ao abrir a página ou quando o JWT vence). */
export const renovarSessao = () =>
  chamar("sessao", async () => {
    const sessao = await postar<Sessao | null>("/auth/refresh");
    if (!sessao?.usuario) throw new ContaErro("sua sessão expirou.", 401);
    return sessao;
  });

export const sair = () => chamar("sessao", () => postar<null>("/auth/logout"));
