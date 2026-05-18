"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../lib/authClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  async function handleSignIn() {
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Signed in successfully.");

    router.push("/planner");
  }

  async function handleSignUp() {
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await signUp(email, password);

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage(
      "Account created. Please check your email and click the confirmation link to finish setting up your account.",
    );
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-[#213128]">Account</h1>

      <input
        type="email"
        placeholder="Email"
        className="border border-[#d8d2c8] p-3 w-full mb-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border border-[#d8d2c8] p-3 w-full mb-4 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignIn}
        disabled={loading}
        className="bg-[#213128] text-white px-4 py-3 rounded w-full mb-3 disabled:opacity-50"
      >
        {loading ? "Please wait..." : "Sign In"}
      </button>

      <button
        onClick={handleSignUp}
        disabled={loading}
        className="border border-[#213128] text-[#213128] px-4 py-3 rounded w-full disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      {message && (
        <div className="mt-5 rounded bg-[#eef3ef] p-4 text-sm text-[#213128]">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mt-5 rounded bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
    </main>
  );
}
