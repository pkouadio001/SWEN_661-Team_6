import { Link } from 'react-router-dom';
import { Heart, Check, Pill, Calendar, Activity, Phone, Users, Shield } from 'lucide-react';

export function LandingPage() {
  const features = [
    { icon: Pill, title: 'Medication Management', desc: 'Never miss a dose with easy tracking designed for motor control challenges.' },
    { icon: Calendar, title: 'Appointment Scheduling', desc: 'Manage doctor visits and therapy sessions with a simple calendar interface.' },
    { icon: Activity, title: 'Health Tracking', desc: 'Log symptoms, mood, and medication effects to share detailed insights with your healthcare team.' },
    { icon: Phone, title: 'Emergency Access', desc: 'One-tap emergency calling with extra-large buttons. Access critical medical contacts instantly.' },
    { icon: Users, title: 'Caretaker Communication', desc: 'Stay connected with your care team through easy-to-use messaging.' },
    { icon: Shield, title: 'Designed for Accessibility', desc: 'Extra-large buttons, high-contrast text, and generous spacing make this app easy to use.' },
  ];

  const accessibilityFeatures = [
    'Extra-large buttons (96-112px) for easy tapping',
    'High-contrast colors for better visibility',
    'Large text (20px+) that\'s easy to read',
    'Generous spacing between all elements',
    'One-tap emergency calling',
    'Designed specifically for motor difficulties',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary-500 to-cyan-500 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareConnect</span>
              <span className="text-sm text-gray-500 hidden sm:inline">for Parkinson's Patients</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/signin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Healthcare Management
          </h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-500 mb-6">
            Designed for You
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            CareConnect is specially designed for Parkinson's disease patients with extra-large buttons, high-contrast text, and accessibility features that make managing your health easier than ever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signin"
              className="w-full sm:w-auto px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/signin"
              className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Accessibility First Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Accessibility First
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibilityFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              All your healthcare management tools in one accessible, easy-to-use platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = [
                'bg-green-100 text-green-600',
                'bg-blue-100 text-blue-600',
                'bg-purple-100 text-purple-600',
                'bg-red-100 text-red-600',
                'bg-orange-100 text-orange-600',
                'bg-cyan-100 text-cyan-600',
              ];
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 ${colors[index]} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Ready Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-red-500 rounded-2xl flex items-center justify-center">
                  <Phone className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-red-900 mb-3">
                  Emergency Ready
                </h3>
                <p className="text-red-800 mb-4">
                  Our extra-large 911 emergency button (112-144px) ensures you can call for help instantly, even during motor difficulties.
                </p>
                <ul className="space-y-2 text-red-800">
                  <li className="flex items-center justify-center sm:justify-start space-x-2">
                    <Check className="w-5 h-5 text-red-600" />
                    <span>One-tap emergency calling</span>
                  </li>
                  <li className="flex items-center justify-center sm:justify-start space-x-2">
                    <Check className="w-5 h-5 text-red-600" />
                    <span>Quick access to emergency contacts</span>
                  </li>
                  <li className="flex items-center justify-center sm:justify-start space-x-2">
                    <Check className="w-5 h-5 text-red-600" />
                    <span>Medical information readily available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Parkinson's patients who have found independence through accessible healthcare management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signin"
              className="w-full sm:w-auto px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              Get Started Free
            </Link>
            <button className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-cyan-500 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">CareConnect</span>
            </div>
            <p className="text-gray-400 text-center mb-2">
              Empowering Parkinson's patients through accessible healthcare technology
            </p>
            <p className="text-gray-500 text-sm">
              © 2026 CareConnect. Designed with accessibility in view for Parkinson's disease patients.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}