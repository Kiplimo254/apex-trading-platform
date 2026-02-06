const stats = [
  { value: "$2.5B+", label: "Total Volume Traded" },
  { value: "50K+", label: "Active Investors" },
  { value: "15%", label: "Average Monthly Returns" },
  { value: "99.9%", label: "Uptime Guarantee" },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-5xl font-display font-bold text-gradient-gold mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
