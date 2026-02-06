import { UserPlus, Wallet, TrendingUp, Banknote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in minutes with just your email. Verify your identity to unlock all features.",
  },
  {
    icon: Wallet,
    step: "02",
    title: "Deposit Funds",
    description: "Fund your account using crypto or traditional payment methods. Start from just $100.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Start Earning",
    description: "Our expert agents trade on your behalf. Watch your investment grow in real-time.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Withdraw Profits",
    description: "Request withdrawals anytime. Funds arrive in your account within 24 hours.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Getting Started
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Start your investment journey in four simple steps. No experience required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative">
                {/* Step Number */}
                <div className="text-6xl font-display font-bold text-primary/10 absolute -top-4 -left-2">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6 shadow-gold">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
