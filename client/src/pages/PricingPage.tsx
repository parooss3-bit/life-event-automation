import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../lib/api';
import { Check } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  maxContacts: number;
  aiVideoGeneration: boolean;
  giftRecommendations: boolean;
}

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tiers
        const tiersResponse = await apiClient.client.get('/api/v1/subscriptions/tiers');
        setTiers(tiersResponse.data.tiers);

        // Fetch current subscription if logged in
        if (user) {
          const subResponse = await apiClient.client.get('/api/v1/subscriptions/current');
          setCurrentSubscription(subResponse.data);
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUpgrade = async (tierId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await apiClient.client.post('/api/v1/subscriptions/checkout', {
        tierId,
        successUrl: `${window.location.origin}/settings?success=true`,
        cancelUrl: `${window.location.origin}/pricing?cancelled=true`,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => {
            const isCurrentPlan = currentSubscription?.tierId === tier.id;
            const isFree = tier.id === 'free';

            return (
              <div
                key={tier.id}
                className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  isCurrentPlan ? 'ring-2 ring-primary' : ''
                } ${isFree ? 'bg-gray-50' : 'bg-white'}`}
              >
                {/* Card header */}
                <div className={`p-8 ${isFree ? 'bg-gray-100' : 'bg-gradient-to-r from-primary to-secondary'}`}>
                  <h2 className={`text-2xl font-bold mb-2 ${isFree ? 'text-gray-900' : 'text-white'}`}>
                    {tier.name}
                  </h2>
                  <div className="flex items-baseline">
                    <span className={`text-5xl font-bold ${isFree ? 'text-gray-900' : 'text-white'}`}>
                      ${tier.price}
                    </span>
                    {tier.price > 0 && (
                      <span className={`ml-2 ${isFree ? 'text-gray-600' : 'text-white/80'}`}>
                        /month
                      </span>
                    )}
                  </div>
                  {isCurrentPlan && (
                    <div className="mt-4 inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-8">
                  {/* Features list */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button */}
                  {isFree ? (
                    <button
                      disabled={isCurrentPlan}
                      className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-300 text-gray-600 cursor-not-allowed"
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Your Plan'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        isCurrentPlan
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'btn-primary'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) via Stripe.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Start with our Free plan to explore all features. Upgrade anytime to unlock advanced features.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I cancel?
              </h3>
              <p className="text-gray-600">
                You can cancel anytime. Your subscription will remain active until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
