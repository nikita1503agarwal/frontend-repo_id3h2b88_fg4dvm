import { useState } from "react";

const CompanyForm = ({ onCreated }) => {
  const [form, setForm] = useState({ name: "", tax_id: "", sector: "", contact_email: "", contact_phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${backend}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      const data = await res.json();
      onCreated && onCreated(data._id);
      setForm({ name: "", tax_id: "", sector: "", contact_email: "", contact_phone: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Raison sociale" name="name" value={form.name} onChange={handleChange} required />
        <input className="input" placeholder="Matricule fiscal" name="tax_id" value={form.tax_id} onChange={handleChange} required />
        <input className="input" placeholder="Secteur" name="sector" value={form.sector} onChange={handleChange} />
        <input className="input" placeholder="Email" name="contact_email" value={form.contact_email} onChange={handleChange} />
        <input className="input" placeholder="Téléphone" name="contact_phone" value={form.contact_phone} onChange={handleChange} />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button disabled={loading} className="btn-primary">{loading ? "Enregistrement..." : "Ajouter l'entreprise"}</button>
    </form>
  );
};

export default CompanyForm;