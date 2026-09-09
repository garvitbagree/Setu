export default function Home() {
  return (
    <main className="min-h-screen bg-white p-10 space-y-6">
      <h1 className="font-serif text-4xl tracking-widest text-navy">SETU</h1>
      <h2 className="font-sans font-bold text-5xl text-deep-purple">
        Hola Bagree.
      </h2>
      <div className="flex gap-4">
        <button className="rounded-full bg-lavender px-6 py-3 font-semibold">
          Login as CSR Manager
        </button>
        <button className="rounded-full bg-lime px-6 py-3 font-semibold">
          Send EOI
        </button>
        <button className="rounded-full bg-danger text-white px-6 py-3 font-semibold">
          Remove
        </button>
      </div>
      <div className="rounded-2xl bg-field-grey p-6 w-64">
        Field / card placeholder
      </div>
    </main>
  );
}