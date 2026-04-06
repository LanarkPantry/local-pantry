"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../lib/authClient";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignIn() {
    const { error } = await signIn(email, password);
    if (!error) router.push("/planner");
  }

  async function handleSignUp() {
    const { error } = await signUp(email, password);
    if (!error) router.push("/planner");
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignIn}
        className="bg-[#213128] text-white px-4 py-2 rounded w-full mb-2"
      >
        Sign In
      </button>
      <button
        onClick={handleSignUp}
        className="border px-4 py-2 rounded w-full"
      >
        Sign Up
      </button>
    </main>
  );
}
