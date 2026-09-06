import { ArrowRight, Database } from 'lucide-react';
import  { dashboards } from './components/dashboard-grids';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            AIML Projects
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Select an AI/ML project 
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {dashboards.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id}
                className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-slate-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs font-medium text-slate-500">
                    <Database className="h-3.5 w-3.5" />
                    <span>{item.stats}</span>
                  </div>

                  <a href={item.link}>
                    <button className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 cursor-pointer">
                      <span>Launch Project</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </a>
                </div>

                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}