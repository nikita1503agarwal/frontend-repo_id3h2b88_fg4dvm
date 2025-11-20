import CompanyForm from "./components/CompanyForm";
import LoanForm from "./components/LoanForm";
import LoanActivity from "./components/LoanActivity";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen p-6 md:p-10">
        <header className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Portail des emprunts extérieurs</h1>
          <p className="text-blue-200/80 mt-2">Recensement des prêts contractés par les entreprises tunisiennes auprès des non-résidents.</p>
        </header>

        <main className="max-w-6xl mx-auto grid gap-8">
          <section className="bg-slate-800/40 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">1. Enregistrer une entreprise</h2>
            <CompanyForm />
          </section>

          <section className="bg-slate-800/40 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">2. Déclarer un prêt</h2>
            <LoanForm />
          </section>

          <section className="bg-slate-800/40 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">3. Tirages et remboursements</h2>
            <LoanActivity />
          </section>
        </main>
      </div>

      {/* Tailwind helpers */}
      <style>{`
        .input{ @apply w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40; }
        .btn-primary{ @apply inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition; }
      `}</style>
    </div>
  )
}

export default App