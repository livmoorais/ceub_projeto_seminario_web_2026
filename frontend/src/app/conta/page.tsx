"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buttonClasses, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { renovarSessao, sair } from "@/lib/api/contas";
import { catalogoUrl, ROUTES } from "@/lib/routes";
import { useSessao } from "@/lib/sessao";

/** Área da conta. Sem sessão na memória, tenta recuperar pelo cookie; sem cookie válido, vai para o login. */
export default function ContaPage() {
  const router = useRouter();
  const sessao = useSessao((s) => s.sessao);
  const definir = useSessao((s) => s.definir);
  const [saindo, setSaindo] = useState(false);
  // tenta recuperar a sessão uma única vez ao abrir a página (e nunca depois de sair)
  const jaTentou = useRef(false);

  useEffect(() => {
    if (sessao || jaTentou.current) return;
    jaTentou.current = true;
    renovarSessao()
      .then(definir)
      .catch(() => router.replace(ROUTES.entrar));
  }, [sessao, definir, router]);

  async function encerrar() {
    jaTentou.current = true;
    setSaindo(true);
    await sair().catch(() => undefined);
    definir(null);
    router.replace(ROUTES.entrar);
  }

  if (!sessao) {
    return (
      <p role="status" className="min-h-[60vh] px-4 py-24 text-center text-roxo-soft">
        carregando sua conta…
      </p>
    );
  }

  const { usuario } = sessao;
  return (
    <section className="bg-dots">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <SectionHeading eyebrow="minha conta">
          olá, <span className="text-violeta italic">{usuario.nome.split(" ")[0]}</span>
        </SectionHeading>

        <dl className="mt-10 grid gap-4 rounded-[1.5rem] border-2 border-roxo bg-nevoa p-6 shadow-[6px_6px_0_0_var(--color-roxo)] sm:grid-cols-2 sm:p-8">
          <div>
            <dt className="text-xs font-bold tracking-[0.18em] text-violeta uppercase">nome</dt>
            <dd className="mt-1 text-lg font-medium">{usuario.nome}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold tracking-[0.18em] text-violeta uppercase">e-mail</dt>
            <dd className="mt-1 text-lg font-medium break-all">{usuario.email}</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={catalogoUrl()} variant="violeta" size="lg">
            ir pra vitrine
          </ButtonLink>
          <button type="button" onClick={encerrar} disabled={saindo} className={buttonClasses("nevoa", "lg")}>
            {saindo ? "saindo…" : "sair da conta"}
          </button>
        </div>
      </div>
    </section>
  );
}
