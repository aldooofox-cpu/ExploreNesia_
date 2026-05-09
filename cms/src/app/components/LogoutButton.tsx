'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      className="btn btnDanger"
      onClick={() => {
        document.cookie = 'cms_logged_in=0; path=/; max-age=0';
        router.push('/login');
      }}
    >
      Logout
    </button>
  );
}

