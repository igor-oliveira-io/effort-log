/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // ou "id" dependendo do backend
  [key: string]: any;
}

export default function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub || null);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setUserId(null);
      }
    }
  }, []);

  return userId;
}
