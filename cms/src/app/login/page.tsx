'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/admin/wisata';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      document.cookie = `cms_logged_in=1; path=/; max-age=${60 * 60 * 24}`;
      router.push(next);
      return;
    }

    setError('Username atau password salah');
  };

  return (
    <div className="container">
      <div className="panel" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0, fontSize: 18, marginBottom: 4 }}>ExploreNesia CMS</h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>
          Login admin untuk mengelola Wisata, Trip, dan Booking.
        </div>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <div className="fieldLabel">
            Username
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="fieldLabel">
            Password
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 2 }}>
              {error}
            </div>
          ) : null}

          <button className="btn" type="submit" style={{ padding: '10px 14px' }}>
            Masuk
          </button>
        </form>

        <div className="inputHelp">
          Default demo: <b>admin / admin</b>
        </div>
      </div>
    </div>
  );
}

