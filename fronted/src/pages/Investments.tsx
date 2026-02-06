import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { TrendingUp, Check, Star, Clock, Wallet } from "lucide-react";

const investmentPlans = [
  {
    id: "starter",
    name: "Starter",
    minDeposit: 100,
    maxDeposit: 999,
    dailyReturn: 2,
    duration: 30,
    features: [
      "Daily profit payouts",
      "Basic support",
      "Single withdrawal per week",
      "Referral bonus 5%",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    minDeposit: 1000,
    maxDeposit: 9999,
    dailyReturn: 3.5,
    duration: 45,
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
    id: "enterprise",
    name: "Enterprise",
    minDeposit: 10000,
    maxDeposit: null,
    dailyReturn: 5,
    duration: 60,
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

const activeInvestments = [
  {
    id: 1,
    plan: "Professional",
    amount: 5000,
    dailyReturn: 3.5,
    totalEarned: 875,
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    daysLeft: 25,
    progress: 44,
    status: "active",
  },
  {
    id: 2,
    plan: "Starter",
    amount: 500,
    dailyReturn: 2,
    totalEarned: 60,
    startDate: "2024-01-10",
    endDate: "2024-02-09",
    daysLeft: 18,
    progress: 40,
    status: "active",
  },
];

const completedInvestments = [
  {
    id: 3,
    plan: "Starter",
    amount: 300,
    dailyReturn: 2,
    totalEarned: 180,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    status: "completed",
  },
];

const Investments = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Mock balance - will be replaced with real data
  const availableBalance = 12450.0;

  const handleInvest = (planId: string) => {
    setSelectedPlan(planId);
    setShowInvestModal(true);
  };

  const handleConfirmInvestment = () => {
    // Will be connected to backend later
    console.log("Investment:", { plan: selectedPlan, amount: investmentAmount });
    setShowInvestModal(false);
    setInvestmentAmount("");
  };

  const selectedPlanData = investmentPlans.find((p) => p.id === selectedPlan);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Investments
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose an investment plan and start earning daily returns
          </p>
        </div>

        {/* Available Balance */}
        <div className="glass rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available to Invest</p>
            <p className="text-3xl font-display font-bold text-gradient-gold">
              ${availableBalance.toLocaleString()}
            </p>
          </div>
          <Wallet className="w-12 h-12 text-primary" />
        </div>

        {/* Investment Plans */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Investment Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investmentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative glass rounded-2xl p-6 ${
                  plan.popular ? "border-2 border-primary shadow-gold" : ""
                }`}
              >
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

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-display font-bold text-gradient-gold mb-1">
                    {plan.dailyReturn}%
                  </div>
                  <p className="text-sm text-muted-foreground">Daily Return</p>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Min Deposit</span>
                    <span className="text-foreground font-semibold">
                      ${plan.minDeposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Max Deposit</span>
                    <span className="text-foreground font-semibold">
                      {plan.maxDeposit
                        ? `$${plan.maxDeposit.toLocaleString()}`
                        : "Unlimited"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground font-semibold">
                      {plan.duration} Days
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : "hero-outline"}
                  className="w-full"
                  onClick={() => handleInvest(plan.id)}
                >
                  Invest Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Investments */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Active Investments
          </h2>
          {activeInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeInvestments.map((investment) => (
                <div
                  key={investment.id}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">
                          {investment.plan} Plan
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {investment.dailyReturn}% daily
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-success/20 text-success text-sm font-medium rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="text-lg font-bold text-foreground">
                        ${investment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        Total Earned
                      </p>
                      <p className="text-lg font-bold text-success">
                        ${investment.totalEarned.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Progress
                      </span>
                      <span className="text-foreground">
                        {investment.daysLeft} days left
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                        style={{ width: `${investment.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{investment.startDate}</span>
                      <span>{investment.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No active investments
              </p>
              <p className="text-sm text-muted-foreground">
                Choose a plan above to start earning
              </p>
            </div>
          )}
        </div>

        {/* Completed Investments */}
        {completedInvestments.length > 0 && (
          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-6">
              Completed Investments
            </h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Plan
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Total Earned
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedInvestments.map((investment) => (
                    <tr key={investment.id} className="border-t border-border">
                      <td className="p-4 font-medium text-foreground">
                        {investment.plan}
                      </td>
                      <td className="p-4 text-foreground">
                        ${investment.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-success font-medium">
                        +${investment.totalEarned.toLocaleString()}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {investment.startDate} - {investment.endDate}
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Investment Modal */}
        {showInvestModal && selectedPlanData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowInvestModal(false)}
            />
            <div className="relative glass rounded-2xl p-8 max-w-md w-full animate-scale-in">
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                Invest in {selectedPlanData.name}
              </h3>
              <p className="text-muted-foreground mb-6">
                Enter the amount you want to invest
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={selectedPlanData.minDeposit}
                    max={selectedPlanData.maxDeposit || undefined}
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none text-foreground"
                    placeholder={`Min: $${selectedPlanData.minDeposit}`}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Available: ${availableBalance.toLocaleString()}
                  </p>
                </div>

                {investmentAmount && (
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Return</span>
                      <span className="text-success">
                        $
                        {(
                          (parseFloat(investmentAmount) *
                            selectedPlanData.dailyReturn) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Expected ({selectedPlanData.duration} days)
                      </span>
                      <span className="text-success font-bold">
                        $
                        {(
                          (parseFloat(investmentAmount) *
                            selectedPlanData.dailyReturn *
                            selectedPlanData.duration) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowInvestModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleConfirmInvestment}
                  disabled={
                    !investmentAmount ||
                    parseFloat(investmentAmount) < selectedPlanData.minDeposit
                  }
                >
                  Confirm Investment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Investments;
