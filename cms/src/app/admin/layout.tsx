import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="adminHeader">
        <div className="adminBrand">
          <div className="adminBrandTitle">ExploreNesia CMS</div>
          <div className="adminBrandSub">Admin Panel</div>
        </div>

        <nav className="adminNav">
          <Link href="/admin/wisata">Wisata</Link>
          <Link href="/admin/trip">Trip</Link>
          <Link href="/admin/booking">Booking</Link>
        </nav>

        <div className="adminHeaderRight">
          <LogoutButton />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}





