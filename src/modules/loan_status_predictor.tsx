import { useState, type FormEvent } from "react";
import { CreditCard, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const MODEL = {
  not_approved: {
    income_coef: -0.02338149,
    credit_coef: -0.00339524,
    intercept: 1404.76483075,
  },
  hold: {
    income_coef: 0.00428368,
    credit_coef: 0.00322152,
    intercept: -103.31600381,
  },
  approved: {
    income_coef: 0.01909783,
    credit_coef: 0.00017407,
    intercept: -1301.44882691,
  },
};

function softmax(scores: number[]): number[] {
  const expScores = scores.map((s) => Math.exp(s));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  return expScores.map((e) => e / sumExp);
}

interface PredictionResult {
  status: string;
  probs: [string, string, string];
}

export default function LoanStatusPredictor() {
  const [form, setForm] = useState({
    income: "",
    credit: "",
  });
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const income = parseFloat(form.income);
    const credit = parseFloat(form.credit);

    if (isNaN(income) || isNaN(credit) || income <= 0 || credit <= 0) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const scores = [
      MODEL.not_approved.income_coef * income +
        MODEL.not_approved.credit_coef * credit +
        MODEL.not_approved.intercept,

      MODEL.hold.income_coef * income +
        MODEL.hold.credit_coef * credit +
        MODEL.hold.intercept,

      MODEL.approved.income_coef * income +
        MODEL.approved.credit_coef * credit +
        MODEL.approved.intercept,
    ];

    const probabilities = softmax(scores);
    const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
    const statuses = ["Not Approved", "Hold", "Approved"];
    const predictedStatus = statuses[maxProbIndex];

    setResult({
      status: predictedStatus,
      probs: [
        (probabilities[0] * 100).toFixed(2),
        (probabilities[1] * 100).toFixed(2),
        (probabilities[2] * 100).toFixed(2),
      ],
    });
  };

  const getResultStyles = (status: string) => {
    if (status === "Approved")
      return "bg-emerald-50 border-emerald-200 text-emerald-900";
    if (status === "Hold") return "bg-amber-50 border-amber-200 text-amber-900";
    return "bg-rose-50 border-rose-200 text-rose-900";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <a
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Home</span>
        </a>
      </div>

      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-8 mt-12 sm:mt-0">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-md">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Loan Status Predictor
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Predict your loan approval status
            </p>
          </div>
        </div>

        <form onSubmit={handlePredict} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Income (NPR)
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              min="0"
              value={form.income}
              onChange={(e) => setForm({ ...form, income: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Credit Score
            </label>
            <input
              type="number"
              placeholder="e.g. 650"
              min="300"
              max="850"
              value={form.credit}
              onChange={(e) => setForm({ ...form, credit: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>

          {error && (
            <div className="text-rose-600 text-xs font-medium">
              Please fill in all fields with valid values.
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-black hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Predict Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-4 border rounded-2xl ${getResultStyles(result.status)}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Predicted Loan Status
                </p>
                <p className="text-lg font-extrabold">{result.status}</p>
              </div>
            </div>

            <div className="text-xs space-y-1 pt-2 border-t border-current/10">
              <div className="flex justify-between">
                <span>Not Approved:</span> <strong>{result.probs[0]}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Hold:</span> <strong>{result.probs[1]}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Approved:</span> <strong>{result.probs[2]}%</strong>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          This is an estimate based on your income and credit score.
        </footer>
      </div>
    </div>
  );
}
