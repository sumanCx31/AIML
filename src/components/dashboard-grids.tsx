import { BarChart3, Flower2, Home, Users, CreditCard } from "lucide-react";

export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeColor: string;
  stats: string;
  link: string;
}

export const dashboards: DashboardItem[] = [
  {
    id: "house-price-prediction",
    title: "House Price Prediction",
    description: "Estimate real estate values using regression models based on location, square footage, and amenities.",
    icon: Home,
    badge: "Regression",
    badgeColor: "bg-blue-100 text-blue-800",
    stats: "R² Score: 88.5%",
    link: "/house-price-prediction",
  },
  {
    id: "iris-classification",
    title: "Iris Flower Classification",
    description: "Classify iris flower species (Setosa, Versicolor, Virginica) using petal and sepal measurements.",
    icon: Flower2,
    badge: "Classification",
    badgeColor: "bg-emerald-100 text-emerald-800",
    stats: "100% Accuracy",
    link: "/irisflower",
  },
  {
    id: "loan-status-predictor",
    title: "Loan Status Predictor",
    description: "Predict loan approval status, hold risk, and rejection probability using monthly income and credit score.",
    icon: CreditCard,
    badge: "Classification",
    badgeColor: "bg-amber-100 text-amber-800",
    stats: "92% Accuracy",
    link: "/loan-status-predictor",
  },
  {
    id: "customer-churn",
    title: "Customer Churn Analysis",
    description: "Predict customer retention and identify high-risk accounts using historical behavioral data.",
    icon: Users,
    badge: "Predictive",
    badgeColor: "bg-purple-100 text-purple-800",
    stats: "80.7% Accuracy",
    link: "#",
  },
  {
    id: "sales-forecast",
    title: "Sales & Revenue Forecast",
    description: "Project upcoming quarterly sales trends and seasonal demand variations across multi-channel retail.",
    icon: BarChart3,
    badge: "Time Series",
    badgeColor: "bg-emerald-100 text-emerald-800",
    stats: "........",
    link: "#",
  },
];

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {dashboards.map(({ id, title, description, icon: Icon, badge, badgeColor, stats, link }) => (
        <a key={id} href={link} className="p-4 border rounded-lg hover:shadow-md transition block">
          <Icon className="h-6 w-6 mb-2 text-indigo-600" />
          <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
          <h2 className="text-lg font-bold mt-2">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <span className="text-xs font-medium text-gray-400 mt-4 block">{stats}</span>
        </a>
      ))}
    </div>
  );
};

export default DashboardGrid;