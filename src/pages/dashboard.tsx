/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "@/components/dashboardListView";
import { LoadingWrapper } from "@/components/loadingWrapper";
import { useSession } from "@/hooks/SessionContext";

const Dashboard = () => {
  const { session, loading } = useSession();

  return (
    <LoadingWrapper isLoading={loading} loadingMessage="Loading user data...">
      <div className="h-full space-y-6 p-6">
        {/* Welcome Banner */}
        <div className="rounded-m bg-primary rounded-lg p-4 text-white shadow-md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Welcome, {session?.name}!
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Here's an overview of your current projects:
          </p>
        </div>

        {/* User's Projects Section */}
        <DashboardListView {...(session?.collaborations || [])} />
      </div>
    </LoadingWrapper>
  );
};

export default Dashboard;
