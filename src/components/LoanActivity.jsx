import { useEffect, useState } from "react";

const Row = ({ children }) => <div className="flex items-center justify-between py-1 text-sm">{children}</div>;

const LoanActivity = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [loans, setLoans] = useState([]);
  const [selected, setSelected] = useState("");
  const [draw, setDraw] = useState({ amount: "", date: "", remarks: "" });
  const [pay, setPay] = useState({ amount: "", date: "", component: "principal", planned: false });
  const [activity, setActivity] = useState({ drawdowns: [], repayments: [] });

  useEffect(() => {
    fetch(`${backend}/loans`).then(r => r.json()).then(setLoans).catch(() => setLoans([]));
  }, [backend]);

  useEffect(() => {
    if (!selected) return;
    Promise.all([
      fetch(`${backend}/drawdowns?loan_id=${selected}`).then(r=>r.json()),
      fetch(`${backend}/repayments?loan_id=${selected}`).then(r=>r.json())
    ]).then(([d, p]) => setActivity({ drawdowns: d, repayments: p })).catch(()=>setActivity({ drawdowns: [], repayments: [] }));
  }, [selected, backend]);

  const addDraw = async (e) => {
    e.preventDefault();
    const payload = { ...draw, loan_id: selected, amount: parseFloat(draw.amount || 0) };
    await fetch(`${backend}/drawdowns`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setDraw({ amount: "", date: "", remarks: "" });
    const d = await fetch(`${backend}/drawdowns?loan_id=${selected}`).then(r=>r.json());
    setActivity(a => ({ ...a, drawdowns: d }));
  };

  const addPay = async (e) => {
    e.preventDefault();
    const payload = { ...pay, planned: !!pay.planned, loan_id: selected, amount: parseFloat(pay.amount || 0) };
    await fetch(`${backend}/repayments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setPay({ amount: "", date: "", component: "principal", planned: false });
    const p = await fetch(`${backend}/repayments?loan_id=${selected}`).then(r=>r.json());
    setActivity(a => ({ ...a, repayments: p }));
  };

  return (
    <div className="space-y-4">
      <select value={selected} onChange={(e)=>setSelected(e.target.value)} className="input">
        <option value="">Sélectionnez un prêt</option>
        {loans.map(l => <option key={l._id} value={l._id}>{l.lender_name} • {l.currency} {l.principal_amount}</option>)}
      </select>

      {selected && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-3">Tirages</h3>
            <form onSubmit={addDraw} className="grid grid-cols-3 gap-2 mb-3">
              <input className="input" type="number" step="0.01" placeholder="Montant" value={draw.amount} onChange={e=>setDraw({ ...draw, amount: e.target.value })} required />
              <input className="input" type="date" value={draw.date} onChange={e=>setDraw({ ...draw, date: e.target.value })} required />
              <input className="input" placeholder="Remarques" value={draw.remarks} onChange={e=>setDraw({ ...draw, remarks: e.target.value })} />
              <button className="btn-primary col-span-3">Ajouter</button>
            </form>
            <div className="space-y-1 max-h-64 overflow-auto pr-2">
              {activity.drawdowns.map(d => (
                <Row key={d._id}>
                  <span className="text-blue-200/80">{d.date}</span>
                  <span className="text-white">{d.amount}</span>
                </Row>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-3">Remboursements</h3>
            <form onSubmit={addPay} className="grid grid-cols-4 gap-2 mb-3">
              <input className="input" type="number" step="0.01" placeholder="Montant" value={pay.amount} onChange={e=>setPay({ ...pay, amount: e.target.value })} required />
              <input className="input" type="date" value={pay.date} onChange={e=>setPay({ ...pay, date: e.target.value })} required />
              <select className="input" value={pay.component} onChange={e=>setPay({ ...pay, component: e.target.value })}>
                <option value="principal">Principal</option>
                <option value="interest">Intérêts</option>
                <option value="fees">Frais</option>
              </select>
              <label className="flex items-center gap-2 text-blue-200/80"><input type="checkbox" checked={pay.planned} onChange={e=>setPay({ ...pay, planned: e.target.checked })}/> Planifié</label>
              <button className="btn-primary col-span-4">Ajouter</button>
            </form>
            <div className="space-y-1 max-h-64 overflow-auto pr-2">
              {activity.repayments.map(r => (
                <Row key={r._id}>
                  <span className="text-blue-200/80">{r.date}</span>
                  <span className="text-white">{r.component} • {r.amount} {r.planned ? "(planifié)" : ""}</span>
                </Row>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanActivity;