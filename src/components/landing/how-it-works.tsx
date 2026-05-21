import { Briefcase, GraduationCap, Rocket, UserPlus } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    body: "Register on Prentix and tell us a little about yourself, your interests, and career goals.",
  },
  {
    icon: Briefcase,
    title: "Complete Real-World Tasks",
    body: "Enroll in a virtual internship and work on practical phases designed to mirror real job responsibilities.",
  },
  {
    icon: GraduationCap,
    title: "Learn & Get Certified",
    body: "Gain Insights and earn a verified completion certificate",
  },
  {
    icon: Rocket,
    title: "Stand Out & Get Hired",
    body: "Share your certificate and showcase your initiative, skills, and readiness to employers.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            The Process
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How Prentix Works
          </h2>
          <p className="mt-4 text-lg text-foreground/90">
            Prentix bridges the gap between education and career success.
          </p>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
            Our virtual internships help students gain real-world exposure by solving tasks
            inspired by actual workplace challenges. Explore career paths, build practical skills,
            and experience what it’s like to work in leading companies before landing your first
            job.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-9 left-[12%] right-[12%] h-px"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.78 0.09 80 / 0.4) 50%, transparent 0)",
              backgroundSize: "10px 1px",
              backgroundRepeat: "repeat-x",
            }}
            aria-hidden
          />
          <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.title}
                  className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-background border border-primary text-[10px] font-semibold text-primary flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}