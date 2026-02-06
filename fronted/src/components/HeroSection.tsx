import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Trusted by 50,000+ investors worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Invest Smarter with{" "}
            <span className="text-gradient-gold">Expert-Managed</span>{" "}
            Trading
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Access professional crypto and forex trading with guaranteed returns.
            Deposit, invest, and watch your wealth grow with our expert agents.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Investing Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Secure & Regulated</h3>
              <p className="text-sm text-muted-foreground">Bank-grade security protocols</p>
            </div>
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Instant Withdrawals</h3>
              <p className="text-sm text-muted-foreground">Get your funds within 24 hours</p>
            </div>
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Refer & Earn</h3>
              <p className="text-sm text-muted-foreground">Earn bonuses for referrals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
