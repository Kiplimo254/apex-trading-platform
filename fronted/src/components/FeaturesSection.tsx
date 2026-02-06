import { 
  Wallet, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Shield, 
  Headphones 
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Easy Deposits",
    description: "Fund your account instantly with crypto or fiat. Multiple payment methods supported.",
  },
  {
    icon: TrendingUp,
    title: "Expert Trading",
    description: "Professional agents manage your portfolio with proven strategies for maximum returns.",
  },
  {
    icon: CreditCard,
    title: "Fast Withdrawals",
    description: "Withdraw your earnings anytime. Process completed within 24 hours guaranteed.",
  },
  {
    icon: Users,
    title: "Referral Program",
    description: "Earn generous commissions by inviting friends. Unlimited earning potential.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Military-grade encryption and 2FA protect your investments around the clock.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated team is always available to help you with any questions.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient-gold">Grow Wealth</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete suite of investment tools designed to maximize your returns
            with minimal effort on your part.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass rounded-2xl p-8 hover:shadow-gold transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
