import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Eye, EyeOff, ArrowRight, HelpCircle } from 'lucide-react';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const useDemoAccount = () => {
    setEmail('demo@careconnect.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Back to Home Link */}
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl mb-4">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CareConnect</h1>
            <p className="text-lg text-gray-600">Welcome Back</p>
          </div>

          {/* Sign In Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Sign In to Your Account
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Please enter your login information
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="demo@careconnect.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-cyan-500 text-white rounded-lg hover:from-primary-600 hover:to-cyan-600 transition-all font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            {/* Demo Account Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Account</h3>
              <div className="space-y-1 text-sm text-blue-800 mb-3">
                <p>Email: demo@careconnect.com</p>
                <p>Password: demo123</p>
              </div>
              <button
                type="button"
                onClick={useDemoAccount}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Use demo credentials →
              </button>
            </div>

            {/* Help Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                className="inline-flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Need Help? Contact Support</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-8">
            © 2026 CareConnect. Designed for easy access.
          </p>
        </div>
      </div>
    </div>
  );
}