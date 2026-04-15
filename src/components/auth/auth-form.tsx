"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "login" | "register";
  name: string;
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  isFirebaseEnabled: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
}

export function AuthForm({
  mode,
  name,
  email,
  password,
  error,
  isSubmitting,
  isFirebaseEnabled,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin,
}: AuthFormProps) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-black">
          {mode === "register" ? "Criar conta" : "Entrar na conta"}
        </h2>
        <p className="text-sm text-[var(--muted)]">
          {isFirebaseEnabled
            ? "Firebase Auth ativo nesta versão."
            : "Modo demo ativo até configurar o Firebase."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {mode === "register" ? (
          <label className="block space-y-2 text-sm">
            <span className="text-[var(--muted)]">Nome</span>
            <input className="input" onChange={(event) => onNameChange(event.target.value)} required value={name} />
          </label>
        ) : null}

        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">E-mail</span>
          <input
            className="input"
            onChange={(event) => onEmailChange(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">Senha</span>
          <input
            className="input"
            minLength={6}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-[color-mix(in_srgb,var(--error)_34%,transparent)] bg-[var(--error-soft)] px-3 py-2 text-sm text-rose-100">
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
          onClick={onGoogleLogin}
          variant="secondary"
        >
          Continuar com Google
        </Button>

        <p className="text-center text-sm text-[var(--muted)]">
          {mode === "register" ? "Já tem uma conta?" : "Novo por aqui?"}{" "}
          <Link className="font-semibold text-[var(--primary)]" href={mode === "register" ? "/entrar" : "/cadastro"}>
            {mode === "register" ? "Entrar" : "Criar conta"}
          </Link>
        </p>
      </div>
    </section>
  );
}
