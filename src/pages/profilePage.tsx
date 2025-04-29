/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from "@/hooks/SessionContext";
import { LoadingWrapper } from "@/components/loadingWrapper";
import config from "@/config";

const ProfilePage = () => {
  const { session, loading, logout } = useSession();

  const handleLinkOrcid = () => {
    window.location.href = `${config.apiBaseURL}/orcid/link?redirectUri=${encodeURIComponent(window.location.href)}`;
  };

  const handleDeleteData = () => {
    // TODO: Implement data deletion logic after confirmation
    console.log("Data deletion confirmed");
    // Example: Call an API endpoint to request data deletion
    // apiClient.users_DeleteUserData().then(...);
  };

  return (
    <LoadingWrapper isLoading={loading} loadingMessage="Loading profile...">
      {session ? (
        <div className="container mx-auto max-w-2xl py-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                View and manage your account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{session.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{session.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">ORCID</p>
                <p>{session.user?.orcid_id || "Not linked"}</p>
                {/* TODO: Conditionally render button based on whether ORCID is linked */}
                <Button variant="outline" size="sm" onClick={handleLinkOrcid}>
                  Link ORCID
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4 border-t px-6 py-4">
              <Button variant="outline" onClick={logout}>
                Log Out
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete My Data</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteData}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <p>Please log in to view your profile.</p> // Or redirect to login
      )}
    </LoadingWrapper>
  );
};

export default ProfilePage;
