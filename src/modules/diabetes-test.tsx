import React, { useState } from 'react';
import { HeartPulse, RefreshCw, CheckCircle2, Activity, ArrowLeft } from 'lucide-react';

const MODEL = {
  classes: ["Low Risk", "Moderate Risk", "High Risk"],
  intercepts: [1.22470823, 0.61879321, -1.84350144],
  coefficients: [
    [-6.43670449e-01, -4.80661247e-01, -1.63248830e-02, -1.79258719e-02, -5.75857135e-02, -3.84087045e-02, -1.18864243e-02, -1.71599462e+00, -1.48042622e+00, 3.60928467e-02, -1.27226675e-02, 2.61500968e-02, 8.46223248e-01, 3.11745724e-01],
    [1.08593320e-02, -4.31154681e-02, 5.77534650e-03, -2.01060705e-03, 2.14963616e-02, 1.19337532e-03, 2.67980213e-02, -5.25564899e-02, 9.01955345e-03, -9.14620255e-03, 9.67517489e-03, 2.67162605e-02, 2.56572751e-01, 3.29858645e-01],
    [6.32811117e-01, 5.23776715e-01, 1.05495365e-02, 1.99364789e-02, 3.60893519e-02, 3.72153291e-02, -1.49115969e-02, 1.76855111e+00, 1.47140667e+00, -2.69466441e-02, 3.04749266e-03, -5.28663573e-02, -1.10279600e+00, -6.41604369e-01]
  ],
  scalers: {
    age: { mean: 45.0, std: 12.0 },
    bmi: { mean: 25.0, std: 5.0 },
    hours_sleep_per_night: { mean: 7.0, std: 1.5 },
    stress_level: { mean: 5.0, std: 2.5 },
    fasting_blood_sugar: { mean: 120.0, std: 30.0 },
    hba1c_level: { mean: 5.8, std: 1.2 },
    blood_pressure_systolic: { mean: 125.0, std: 15.0 },
    blood_pressure_diastolic: { mean: 80.0, std: 10.0 },
    waist_circumference_cm: { mean: 88.0, std: 12.0 }
  }
};

export default function DiabetesRiskClassifier() {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    physical_activity_level: '0',
    smoking_status: '0',          
    alcohol_consumption: '0',     
    hours_sleep_per_night: '',
    stress_level: '',
    fasting_blood_sugar: '',
    hba1c_level: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    waist_circumference_cm: '',
    family_history_diabetes: 'No' // No or Yes
  });

  const [prediction, setPrediction] = useState<{
    risk: string;
    probabilities: {
      low: string;
      moderate: string;
      high: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scaleValue = (val: number, mean: number, std: number) => (val - mean) / std;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const age = parseFloat(formData.age);
    const bmi = parseFloat(formData.bmi);
    const activity = parseFloat(formData.physical_activity_level);
    const smoking = parseFloat(formData.smoking_status);
    const alcohol = parseFloat(formData.alcohol_consumption);
    const sleep = parseFloat(formData.hours_sleep_per_night);
    const stress = parseFloat(formData.stress_level);
    const fbs = parseFloat(formData.fasting_blood_sugar);
    const hba1c = parseFloat(formData.hba1c_level);
    const bpSys = parseFloat(formData.blood_pressure_systolic);
    const bpDia = parseFloat(formData.blood_pressure_diastolic);
    const waist = parseFloat(formData.waist_circumference_cm);
    const hasFamilyHistory = formData.family_history_diabetes === 'Yes';

    if (
      [age, bmi, activity, smoking, alcohol, sleep, stress, fbs, hba1c, bpSys, bpDia, waist].some(
        (val) => isNaN(val)
      )
    ) {
      return;
    }

    setLoading(true);
    setPrediction(null);

    setTimeout(() => {
      const scaledFeatures = [
        scaleValue(age, MODEL.scalers.age.mean, MODEL.scalers.age.std),
        scaleValue(bmi, MODEL.scalers.bmi.mean, MODEL.scalers.bmi.std),
        activity,
        smoking,
        alcohol,
        scaleValue(sleep, MODEL.scalers.hours_sleep_per_night.mean, MODEL.scalers.hours_sleep_per_night.std),
        scaleValue(stress, MODEL.scalers.stress_level.mean, MODEL.scalers.stress_level.std),
        scaleValue(fbs, MODEL.scalers.fasting_blood_sugar.mean, MODEL.scalers.fasting_blood_sugar.std),
        scaleValue(hba1c, MODEL.scalers.hba1c_level.mean, MODEL.scalers.hba1c_level.std),
        scaleValue(bpSys, MODEL.scalers.blood_pressure_systolic.mean, MODEL.scalers.blood_pressure_systolic.std),
        scaleValue(bpDia, MODEL.scalers.blood_pressure_diastolic.mean, MODEL.scalers.blood_pressure_diastolic.std),
        scaleValue(waist, MODEL.scalers.waist_circumference_cm.mean, MODEL.scalers.waist_circumference_cm.std),
        hasFamilyHistory ? 0 : 1, // 'No' column
        hasFamilyHistory ? 1 : 0  // 'Yes' column
      ];

      // 2. Linear Dot Products
      const scores = MODEL.intercepts.map((intercept, classIdx) => {
        return scaledFeatures.reduce(
          (sum, featureVal, featIdx) => sum + featureVal * MODEL.coefficients[classIdx][featIdx],
          intercept
        );
      });

      const expScores = scores.map((score) => Math.exp(score));
      const sumExp = expScores.reduce((acc, curr) => acc + curr, 0);
      const probs = expScores.map((exp) => exp / sumExp);
      let maxIdx = 0;
      if (probs[1] > probs[0] && probs[1] > probs[2]) maxIdx = 1;
      if (probs[2] > probs[0] && probs[2] > probs[1]) maxIdx = 2;

      setPrediction({
        risk: MODEL.classes[maxIdx],
        probabilities: {
          low: (probs[0] * 100).toFixed(1),
          moderate: (probs[1] * 100).toFixed(1),
          high: (probs[2] * 100).toFixed(1)
        }
      });

      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100 p-8 sm:p-10 relative">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-white hover:shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-rose-600" />
            <span>Back to Home</span>
          </a>
        </div>

        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100 mt-6 sm:mt-0">
          <div className="p-3.5 bg-rose-50 rounded-2xl text-rose-600 ring-8 ring-rose-50/50">
            <HeartPulse className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Diabetes Risk Assessment</h1>
            <p className="text-sm text-slate-500 font-medium">Logistic Regression Client-Side Inference</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="45"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                BMI (kg/m²)
              </label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                placeholder="24.5"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Physical Activity Level
              </label>
              <select
                name="physical_activity_level"
                value={formData.physical_activity_level}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              >
                <option value="0">Sedentary</option>
                <option value="1">Moderate</option>
                <option value="2">Active</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Smoking Status
              </label>
              <select
                name="smoking_status"
                value={formData.smoking_status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              >
                <option value="0">Never</option>
                <option value="1">Former</option>
                <option value="2">Current</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Alcohol Consumption
              </label>
              <select
                name="alcohol_consumption"
                value={formData.alcohol_consumption}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              >
                <option value="0">Never</option>
                <option value="1">Occasional</option>
                <option value="2">Regular</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Hours Sleep / Night
              </label>
              <input
                type="number"
                step="0.5"
                name="hours_sleep_per_night"
                value={formData.hours_sleep_per_night}
                onChange={handleChange}
                placeholder="7.0"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Stress Level (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                placeholder="5"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Fasting Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                name="fasting_blood_sugar"
                value={formData.fasting_blood_sugar}
                onChange={handleChange}
                placeholder="100"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                HbA1c Level (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="hba1c_level"
                value={formData.hba1c_level}
                onChange={handleChange}
                placeholder="5.5"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                name="blood_pressure_systolic"
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                placeholder="120"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                name="blood_pressure_diastolic"
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                placeholder="80"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Waist Circumference (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="waist_circumference_cm"
                value={formData.waist_circumference_cm}
                onChange={handleChange}
                placeholder="85"
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Family History of Diabetes
              </label>
              <select
                name="family_history_diabetes"
                value={formData.family_history_diabetes}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-sm"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Evaluating Metrics...</span>
              </>
            ) : (
              <>
                <Activity className="h-5 w-5" />
                <span>Calculate Diabetes Risk</span>
              </>
            )}
          </button>
        </form>

        {prediction && (
          <div className="mt-8 p-6 bg-linear-to-br from-rose-50 to-orange-50/35 border border-rose-100 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-rose-600 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Assessment Complete</span>
                <h3 className="text-xl font-black text-slate-900">{prediction.risk}</h3>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-rose-100/60 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Low Risk</span>
                  <span>{prediction.probabilities.low}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${prediction.probabilities.low}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Moderate Risk</span>
                  <span>{prediction.probabilities.moderate}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${prediction.probabilities.moderate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>High Risk</span>
                  <span>{prediction.probabilities.high}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full transition-all duration-500" style={{ width: `${prediction.probabilities.high}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}