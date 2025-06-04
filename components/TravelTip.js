import {
  Plane,
  DollarSign,
  CalendarDays,
  Utensils,
  Users,
  Lightbulb,
  Globe,
  Thermometer,
  Info,
  Passport,
} from 'lucide-react';

export default function TravelTip({ tip }) {
  // Function to map category to a Font Awesome icon component
  const getIconComponent = (icon) => {
    const lowerCaseIcon = icon ? icon.toLowerCase() : '';
    switch (lowerCaseIcon) {
      case 'visa':
      case 'entry':
        return <Plane className="w-6 h-6 text-blue-600" />; // Lucide Plane
      case 'money':
      case 'currency':
      case 'budget':
        return <DollarSign className="w-6 h-6 text-blue-600" />; // Lucide DollarSign
      case 'time':
      case 'season':
      case 'weather':
        return <CalendarDays className="w-6 h-6 text-blue-600" />; // Lucide CalendarDays
      case 'food':
      case 'cuisine':
        return <Utensils className="w-6 h-6 text-blue-600" />; // Lucide Utensils
      case 'people':
      case 'culture':
        return <Users className="w-6 h-6 text-blue-600" />; // Lucide Users
      case 'lightbulb': // Existing case for lightbulb
        return <Lightbulb className="w-6 h-6 text-blue-600" />;
      case 'globe': // Existing case for globe
        return <Globe className="w-6 h-6 text-blue-600" />;
      case 'thermometer': // Existing case for thermometer
        return <Thermometer className="w-6 h-6 text-blue-600" />;
      case 'info': // Existing case for info
        return <Info className="w-6 h-6 text-blue-600" />;
      case 'passport': // Existing case for passport
        return <Passport className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />; // Generic info icon for others
    }
  };

  return (
    <div className="card p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 text-kosovo-blue">
          {/* Render the icon component */}
          {getIconComponent(tip.icon)} {/* Pass category to getIconComponent */}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
          {/* Render content with whitespace-pre-line for formatting */}
          <p className="text-gray-600 whitespace-pre-line">{tip.content}</p>

          {/* Render the list if it exists and has items */}
          {tip.list && Array.isArray(tip.list) && tip.list.length > 0 && (
            <ul className="mt-3 space-y-1 list-disc pl-5">
              {tip.list.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
