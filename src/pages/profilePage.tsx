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
import { useContext, useState } from "react";
import OrcidIcon from "@/components/icons/orcidIcon";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  User,
  UserSession,
} from "@team-golfslag/conflux-api-client/src/client";

const ProfilePage = () => {
  const apiClient = useContext(ApiClientContext);

  const { session, loading, logout, saveSession } = useSession();
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);

  const handleLinkOrcid = () => {
    window.location.href = `${config.apiBaseURL}/orcid/link?redirectUri=${encodeURIComponent(window.location.href)}`;
  };

  const handleUnlinkOrcid = () => {
    apiClient.orcid_OrcidUnlink().then(() => {
      console.log("ORCID unlinked successfully");
      if (session?.user) {
        // Create a new session object with the updated user data
        const updatedSession = new UserSession({
          ...session,
          user: new User({
            ...session.user,
            orcid_id: undefined,
          }),
        });
        saveSession(updatedSession); // Pass the new object to saveSession
      }
      setIsUnlinkDialogOpen(false);
    });
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
                {session.user?.orcid_id ? (
                  <AlertDialog
                    open={isUnlinkDialogOpen}
                    onOpenChange={setIsUnlinkDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <OrcidIcon className="mr-2" /> Unlink ORCID
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unlink ORCID?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to unlink your ORCID account?
                          This action cannot be undone easily.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnlinkOrcid}>
                          Unlink
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleLinkOrcid}>
                    <OrcidIcon className="mr-2" /> Link ORCID
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4 border-t px-6 py-4">
              <Button variant="outline" onClick={logout}>
                Log Out
              </Button>
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
