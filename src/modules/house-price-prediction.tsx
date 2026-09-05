import { useState } from 'react';
import { Home,  Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const NEPAL_INTERCEPT = 6145322.929727629;
const NEPAL_COEF = {
  "size_aana": 3501973.01304593,
  "floors": 2227057.24322236,
  "house_age_years": -288452.00283914,
  "Baluwatar": 33174286.94273959,
  "Baneshwor": 1206700.60164427,
  "Bhaktapur": -28689716.68247237,
  "Boudha": -7991566.61665977,
  "Budhanilkantha": -20633733.8935129,
  "Chabahil": -4432801.54614976,
  "Gongabu": -16382068.72103312,
  "Jhamsikhel": 14803988.4678202,
  "Kalanki": -14539552.42503028,
  "Kalimati": -8490092.98831284,
  "Kirtipur": -24102738.45512374,
  "Koteshwor": -10345011.97866113,
  "Lazimpat": 30700234.43617596,
  "Naxal": 36068553.85116125,
  "New Baneshwor": -1328372.41180944,
  "Sanepa": 20981891.41922424,
};

const LOCATIONS = [
  "Baluwatar", "Baneshwor", "Bhaktapur", "Boudha", 
  "Budhanilkantha", "Chabahil", "Gongabu", "Jhamsikhel", 
  "Kalanki", "Kalimati", "Kirtipur", "Koteshwor", 
  "Lazimpat", "Naxal", "New Baneshwor", "Sanepa"
];

export default function NepalHousePredictor() {
  const [form, setForm] = useState({
    size: '',
    floors: '',
    age: '',
    location: 'Baluwatar'
  });
  const [result, setResult] = useState<string | null>(null);

  const handlePredict = (e:any) => {
    e.preventDefault();
    const size = parseFloat(form.size);
    const floors = parseFloat(form.floors);
    const age = parseFloat(form.age);

    if (isNaN(size) || isNaN(floors) || isNaN(age)) return;

    let price = (
      NEPAL_COEF["size_aana"] * size +
      NEPAL_COEF["floors"] * floors +
      NEPAL_COEF["house_age_years"] * age +
      NEPAL_INTERCEPT
    );

    const locationCoefficient = NEPAL_COEF[form.location as keyof typeof NEPAL_COEF];
    if (locationCoefficient) {
      price += locationCoefficient;
    }

    const finalPrice = Math.max(Math.round(price), 0);
    setResult("NPR " + finalPrice.toLocaleString("en-IN"));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <a 
          href="/" 
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-white hover:shadow transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600" />
          <span>Back to Home</span>
        </a>
      </div>
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-teal-500/10 p-8">
  
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">House Price Predictor</h1>
            <p className="text-xs text-gray-500 font-medium">Kathmandu Valley Client-Side ML</p>
          </div>
        </div>

        <form onSubmit={handlePredict} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Land Size (Aana)</label>
              <input type="number" step="0.1" min="0" placeholder="e.g. 6.5" value={form.size} onChange={e => setForm({...form, size: e.target.value})} required className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Floors</label>
              <input type="number" step="0.5" min="0" placeholder="e.g. 2" value={form.floors} onChange={e => setForm({...form, floors: e.target.value})} required className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">House Age (Years)</label>
            <input type="number" step="1" min="0" placeholder="e.g. 5" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Location</label>
            <select value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition">
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="w-full mt-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer">
            <span>Predict Price</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-linear-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Estimated Price</p>
                <p className="text-base font-extrabold text-gray-900">{result}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}