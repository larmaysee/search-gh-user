import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ADD_ISSUE } from "@/Graphql/Mutations/AddIssue";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@apollo/client";
import { ToastAction } from "@radix-ui/react-toast";
import { Loader, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

type AddIssueDialogProps = {
  repositoryId: string;
  refetchIssue: () => void;
};
export function AddIssueDialog({
  repositoryId,
  refetchIssue,
}: AddIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Use the mutation hook
  const [addIssue, { loading, error }] = useMutation(ADD_ISSUE, {
    onCompleted: () => {
      refetchIssue();
    },
  });

  const onAddIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // log fields data
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {
      await addIssue({
        variables: {
          repositoryId: repositoryId,
          title: data.title,
          body: data.body,
        },
      });

      // close the dialog
      setOpen(false);
    } catch (error: unknown) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message ?? "There was a problem with your request.",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    }
  }, [error, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => console.log("clicked")}
          size={"sm"}
          className="gap-2"
        >
          <PlusCircle size={16} />
          New Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Issue</DialogTitle>
          <DialogDescription>
            Create a new issue for this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onAddIssue}>
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <Input
                id="title"
                type="text"
                name="title"
                disabled={loading}
                placeholder="Enter issue title"
                className="col-span-3"
              />
            </div>
            <div className="items-center gap-4">
              <Textarea
                id="description"
                placeholder="Enter issue details"
                name="body"
                className="col-span-3"
              ></Textarea>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              Create
              {loading && <Loader size={16} className="animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
