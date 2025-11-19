import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Users, TrendingUp, ArrowRight, Shield, Zap, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation(["pages", "common"]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            SAARTHI
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/feed">{t("common:navigation.feed")}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/chatbot">{t("common:navigation.aiAssistant")}</Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">{t("common:navigation.dashboard")}</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/profile">{t("common:navigation.profile")}</Link>
                </Button>
                <NotificationBell />
                <Button variant="outline" onClick={logout}>
                  {t("common:navigation.logout")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("common:navigation.login")}
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("common:navigation.signup")}
                  </Link>
                </Button>
              </>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild>
              <Link to="/report">{t("index.hero.ctaPrimary")}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-info/5 to-secondary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              {t("index.hero.badge")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              {t("index.hero.title").split(',')[0]},
              <br />
              <span className="bg-gradient-to-r from-primary via-info to-secondary bg-clip-text text-transparent">
                {t("index.hero.title").split(',')[1]}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("index.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button size="lg" className="text-lg gap-2">
                  {t("index.hero.ctaPrimary")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="text-lg">
                  {t("index.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t("index.stats.issuesReported"), value: "12,458", icon: MapPin },
              { label: t("index.stats.issuesResolved"), value: "9,234", icon: Shield },
              { label: t("index.stats.activeCitizens"), value: "45,678", icon: Users },
              { label: t("index.stats.responseRate"), value: "94%", icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary" />
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("index.features.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("index.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: t("index.features.smartReporting.title"),
                description: t("index.features.smartReporting.description"),
                color: "text-primary",
              },
              {
                icon: Users,
                title: t("index.features.communityPower.title"),
                description: t("index.features.communityPower.description"),
                color: "text-secondary",
              },
              {
                icon: MessageSquare,
                title: t("index.features.realTimeUpdates.title"),
                description: t("index.features.realTimeUpdates.description"),
                color: "text-accent",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("index.testimonials.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("index.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t("index.testimonials.items", { returnObjects: true }).map((testimonial: any, index: number) => (
              <div key={index} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <p className="text-sm font-medium text-primary">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-info to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t("index.cta.title")}
            </h2>
            <p className="text-xl opacity-90">
              {t("index.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg">
                  {t("index.cta.ctaPrimary")}
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="text-lg bg-white/10 text-white hover:bg-white/20 border-white/20">
                  {t("index.cta.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">SAARTHI</h3>
              <p className="text-sm text-muted-foreground">
                {t("index.footer.description")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("index.footer.platform")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.hero.ctaPrimary")}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.hero.ctaSecondary")}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.trackStatus")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("index.footer.resources")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.helpCenter")}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.guidelines")}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.apiDocs")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("index.footer.legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.privacyPolicy")}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.termsOfService")}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t("index.footer.contact")}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            {t("index.footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
