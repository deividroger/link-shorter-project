import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link2, BarChart2, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Short, Shareable Links",
    description:
      "Turn any long URL into a clean, concise link that's easy to share across any platform.",
  },
  {
    icon: BarChart2,
    title: "Click Analytics",
    description:
      "Track how many times your links are clicked and monitor their performance in real time.",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Redirects",
    description:
      "Our infrastructure ensures your visitors reach their destination in milliseconds.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Every link is tied to your account. Only you can manage and delete your URLs.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col items-center">
      {/* Hero */}
      <section className="flex w-full flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          Shorten links.{" "}
          <span className="text-muted-foreground">Track results.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Create short, memorable URLs in seconds and get real-time analytics on
          every click — all in one simple dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Get Started Free</Button>
          </SignUpButton>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-6 pb-24">
        <h2 className="mb-10 text-center text-2xl font-semibold">
          Everything you need to manage your links
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
