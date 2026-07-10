export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary">
      <h2 className="text-5xl font-extrabold mb-4 gradient-text">404</h2>
      <p className="text-text-secondary text-lg mb-8">Page not found</p>
      <a
        href="/"
        className="
          py-3 px-8 rounded-xl accent-gradient text-black font-bold
          shadow-[0_0_20px_rgba(0,255,136,0.3)]
          hover:-translate-y-0.5 transition-all duration-200
        "
      >
        Go Home
      </a>
    </div>
  );
}
