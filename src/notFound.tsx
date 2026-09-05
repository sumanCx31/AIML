import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sm:p-12">
        
        {/* Icon Container */}
        <div className="inline-flex p-4 bg-rose-50 rounded-2xl text-rose-600 mb-6">
          <AlertTriangle className="h-10 w-10" />
        </div>

        {/* Error Code & Heading */}
        <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4 sm:text-4xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-3 text-slate-600 text-sm leading-relaxed">
          Sorry, we couldn’t find the dashboard or model console you were looking for. It may have been moved or doesn't exist yet.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors duration-200"
          >
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400">
          Analytics & AI Model Hub
        </div>

      </div>
    </div>
  );
}