import { useEffect, useState } from "react";

const LoanForm = ({ onCreated }) => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ company_id: "", lender_name: "", currency: "EUR", principal_amount: "", interest_rate: "", start_date: "", maturity_date: "", purpose: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${backend}/companies`).then(r => r.json()).then(setCompanies).catch(() => setCompanies([]));
  }, [backend]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { ...form, principal_amount: parseFloat(form.principal_amount || 0), interest_rate: form.interest_rate ? parseFloat(form.interest_rate) : null };
      const res = await fetch(`${backend}/loans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Erreur lors de la création du prêt");
      const data = await res.json();
      onCreated && onCreated(data._id);
      setForm({ company_id: "", lender_name: "", currency: "EUR", principal_amount: "", interest_rate: "", start_date: "", maturity_date: "", purpose: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select name="company_id" value={form.company_id} onChange={handleChange} className="input" required>
          <option value="">Sélectionnez l'entreprise</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="input" placeholder="Prêteur non résident" name="lender_name" value={form.lender_name} onChange={handleChange} required />
        <input className="input" placeholder="Devise (ex: EUR)" name="currency" value={form.currency} onChange={handleChange} required />
        <input className="input" type="number" step="0.01" placeholder="Montant du principal" name="principal_amount" value={form.principal_amount} onChange={handleChange} required />
        <input className="input" type="number" step="0.01" placeholder="Taux d'intérêt (%)" name="interest_rate" value={form.interest_rate} onChange={handleChange} />
        <input className="input" type="date" placeholder="Date de début" name="start_date" value={form.start_date} onChange={handleChange} />
        <input className="input" type="date" placeholder="Date d'échéance" name="maturity_date" value={form.maturity_date} onChange={handleChange} />
        <input className="input md:col-span-2" placeholder="Objet du prêt" name="purpose" value={form.purpose} onChange={handleChange} />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button disabled={loading} className="btn-primary">{loading ? "Enregistrement..." : "Ajouter le prêt"}</button>
    </form>
  );
};

export default LoanForm;