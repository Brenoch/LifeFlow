"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLifeFlow } from "@/hooks/use-lifeflow";

interface AuthPanelProps {
  mode: "login" | "register";
}

export function AuthPanel({ mode }: AuthPanelProps) {
  const router = useRouter();
  const { data, isFirebaseEnabled, login, loginWithGoogle, register } = useLifeFlow();
  const [name, setName] = useState("Bruno Silva");
  const [email, setEmail] = useState("bruno@lifeflow.dev");
  const [password, setPassword] = useState("lifeflow123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      router.replace("/");
    }
  }, [data, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      router.push("/");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Falha na autenticação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      router.push("/");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Falha no login com Google.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text)]">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-5xl content-center gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold uppercase tracking-normal text-white">
              LifeFlow
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-4xl">
                Organize o dia antes que ele organize você.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-[#aeb7c2]">
                Acompanhe treinos, planeje blocos de estudo, ganhe XP e mantenha sua sequência honesta.
              </p>
            </div>
          </div>

          <div className="relative h-56 overflow-hidden rounded-lg border border-[var(--border)] sm:h-72">
            <Image
              alt="Pessoa se preparando para uma sessão de treino focada"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101113] via-transparent to-transparent" />
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-bold">
              {mode === "register" ? "Crie sua conta" : "Boas-vindas de volta"}
            </h2>
            <p className="text-sm text-[#aeb7c2]">
              {isFirebaseEnabled
                ? "Firebase Auth está ativo nesta versão."
                : "O modo demo fica ativo até as variáveis do Firebase serem adicionadas."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="block space-y-2 text-sm">
                <span className="text-[#aeb7c2]">Nome</span>
                <input
                  className="input"
                  onChange={(event) => setName(event.target.value)}
                  required
                  value={name}
                />
              </label>
            ) : null}

            <label className="block space-y-2 text-sm">
              <span className="text-[#aeb7c2]">E-mail</span>
              <input
                className="input"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-[#aeb7c2]">Senha</span>
              <input
                className="input"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-rose-300/20 bg-rose-400/12 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {mode === "register" ? "Criar conta" : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 grid gap-3">
            <Button
              className="w-full"
              disabled={!isFirebaseEnabled || isSubmitting}
              onClick={handleGoogleLogin}
              variant="secondary"
            >
              Continuar com Google
            </Button>

            <p className="text-center text-sm text-[#aeb7c2]">
              {mode === "register" ? "Já tem uma conta?" : "Novo por aqui?"}{" "}
              <Link
                className="font-semibold text-violet-200"
                href={mode === "register" ? "/entrar" : "/cadastro"}
              >
                {mode === "register" ? "Entrar" : "Criar uma conta"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
