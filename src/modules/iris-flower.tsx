import React, { useState } from 'react';
import { Flower2, RefreshCw, CheckCircle2, Activity, ArrowLeft } from 'lucide-react';

const MODEL = {
  classes: ["Iris-setosa", "Iris-versicolor", "Iris-virginica"],
};

export default function IrisClassifier() {
  const [formData, setFormData] = useState({
    SepalLengthCm: '',
    SepalWidthCm: '',
    PetalLengthCm: '',
    PetalWidthCm: '',
  });

  const [prediction, setPrediction] = useState<{
    species: string;
    probabilities: {
      setosa: string;
      versicolor: string;
      virginica: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sl = parseFloat(formData.SepalLengthCm);
    const sw = parseFloat(formData.SepalWidthCm);
    const pl = parseFloat(formData.PetalLengthCm);
    const pw = parseFloat(formData.PetalWidthCm);

    if (isNaN(sl) || isNaN(sw) || isNaN(pl) || isNaN(pw)) return;

    setLoading(true);
    setPrediction(null);

    setTimeout(() => {

      const score0 = 9.071770018712012 + (-0.39634220880025917 * sl) + (0.9523850084950785 * sw) + (-2.3762864908952794 * pl) + (-1.013511826451781 * pw);
      const score1 = 1.818209270835834 + (0.5122211702726981 * sl) + (-0.2480965988648085 * sw) + (-0.21455710425907595 * pl) + (-0.762022745956123 * pw);
      const score2 = -10.88997928954779 + (-0.11587896147244738 * sl) + (-0.7042884096302723 * sw) + (2.5908435951543467 * pl) + (1.7755345724079052 * pw);

      const exp0 = Math.exp(score0);
      const exp1 = Math.exp(score1);
      const exp2 = Math.exp(score2);
      const sumExp = exp0 + exp1 + exp2;

      const prob0 = exp0 / sumExp;
      const prob1 = exp1 / sumExp;
      const prob2 = exp2 / sumExp;

      let maxIdx = 0;
      if (prob1 > prob0 && prob1 > prob2) maxIdx = 1;
      if (prob2 > prob0 && prob2 > prob1) maxIdx = 2;

      setPrediction({
        species: MODEL.classes[maxIdx],
        probabilities: {
          setosa: (prob0 * 100).toFixed(1),
          versicolor: (prob1 * 100).toFixed(1),
          virginica: (prob2 * 100).toFixed(1)
        }
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100 p-8 sm:p-10 relative">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <a 
            href="/" 
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-white hover:shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-teal-600" />
            <span>Back to Home</span>
          </a>
        </div>

        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100 mt-6 sm:mt-0">
          <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600 ring-8 ring-emerald-50/50">
            <Flower2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Iris Classification</h1>
            <p className="text-sm text-slate-500 font-medium">Logistic Regression Client-Side Inference</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Sepal Length (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="SepalLengthCm"
                value={formData.SepalLengthCm}
                onChange={handleChange}
                placeholder="5.1"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Sepal Width (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="SepalWidthCm"
                value={formData.SepalWidthCm}
                onChange={handleChange}
                placeholder="3.5"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Petal Length (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="PetalLengthCm"
                value={formData.PetalLengthCm}
                onChange={handleChange}
                placeholder="1.4"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Petal Width (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="PetalWidthCm"
                value={formData.PetalWidthCm}
                onChange={handleChange}
                placeholder="0.2"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Processing Model...</span>
              </>
            ) : (
              <>
                <Activity className="h-5 w-5" />
                <span>Classify Specimen</span>
              </>
            )}
          </button>
        </form>

        {prediction && (
          <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50/35 border border-emerald-100 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Prediction Complete</span>
                <h3 className="text-xl font-black text-slate-900">{prediction.species}</h3>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-emerald-100/60 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Iris-setosa</span>
                  <span>{prediction.probabilities.setosa}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${prediction.probabilities.setosa}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Iris-versicolor</span>
                  <span>{prediction.probabilities.versicolor}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${prediction.probabilities.versicolor}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Iris-virginica</span>
                  <span>{prediction.probabilities.virginica}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-600 h-full rounded-full transition-all duration-500" style={{ width: `${prediction.probabilities.virginica}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}