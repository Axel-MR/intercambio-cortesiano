// src/app/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; // No mostramos nada, ya que redirige inmediatamente
}
