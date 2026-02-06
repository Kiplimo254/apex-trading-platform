import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    minDeposit: "$100",
    maxDeposit: "$999",
    dailyReturn: "2%",
    duration: "30 Days",
    features: [
      "Daily profit payouts",
      "Basic support",
      "Single withdrawal per week",
      "Referral bonus 5%",
    ],
    popular: false,
  },
  {
    name: "Professional",
    minDeposit: "$1,000",
    maxDeposit: "$9,999",
    dailyReturn: "3.5%",
    duration: "45 Days",
    features: [
      "Daily profit payouts",
      "Priority support",
      "Unlimited withdrawals",
      "Referral bonus 7%",
      "Personal account manager",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    minDeposit: "$10,000",
    maxDeposit: "Unlimited",
    dailyReturn: "5%",
    duration: "60 Days",
    features: [
      "Daily profit payouts",
      "VIP support 24/7",
      "Instant withdrawals",
      "Referral bonus 10%",
      "Dedicated trading agent",
      "Custom investment strategies",
    ],
    popular: false,
  },
];

const InvestmentPlans = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Investment Plans
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
            Choose Your <span className="text-gradient-gold">Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Select the investment plan that matches your goals. All plans include
            expert trading and guaranteed returns.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 animate-slide-up ${
                plan.popular
                  ? "glass border-2 border-primary shadow-gold"
                  : "glass"
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1 bg-gradient-gold rounded-full">
                    <Star className="w-4 h-4 text-primary-foreground fill-current" />
                    <span className="text-sm font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-display font-bold text-gradient-gold mb-1">
                  {plan.dailyReturn}
                </div>
                <p className="text-sm text-muted-foreground">Daily Return</p>
              </div>

              {/* Investment Range */}
              <div className="glass rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Min Deposit</span>
                  <span className="text-foreground font-semibold">{plan.minDeposit}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Max Deposit</span>
                  <span className="text-foreground font-semibold">{plan.maxDeposit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground font-semibold">{plan.duration}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.popular ? "hero" : "hero-outline"}
                className="w-full"
              >
                Start Investing
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlans;
