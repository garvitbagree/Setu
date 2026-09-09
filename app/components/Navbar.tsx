export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-navy text-white">
      <span className="font-serif text-2xl tracking-widest">SETU</span>
      <div className="flex items-center gap-8 text-sm font-medium">
        <a href="/domains">Discover NGOs</a>
        <a href="#">Your Mandates</a>
        <a href="#">Shortlist</a>
        <a href="/">Login</a>
        <button className="rounded-full bg-white text-navy px-5 py-2 font-semibold">
          Get Started
        </button>
      </div>
    </nav>
  );
}