import { getSession } from "@/lib/auth/session";
import { TodayView } from "./today-view";

export const metadata = {
  title: "Today",
};

export default async function TodayPage() {
  const session = await getSession();
  const userName = session?.user?.profile?.username || session?.user?.firstname || "Developer";

  return <TodayView userName={userName} />;
}
