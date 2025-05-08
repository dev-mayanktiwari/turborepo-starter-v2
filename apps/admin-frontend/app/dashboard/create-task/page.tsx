"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Slider,
  useToast,
} from "@repo/ui";
import { ImageUpload } from "@/components/dashboard/image-upload";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  reward: z.number().min(0.1, {
    message: "Reward must be at least 0.1 SOL.",
  }),
  maxParticipants: z.number().min(1, {
    message: "Must have at least 1 participant.",
  }),
  images: z.array(z.string()).min(2, {
    message: "You must upload at least 2 images.",
  }),
});

export default function CreateTaskPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      reward: 0.5,
      maxParticipants: 10,
      images: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a task.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would integrate with Solana to process the payment
      console.log("Creating task:", values);

      // Mock successful task creation
      setTimeout(() => {
        toast({
          title: "Task created successfully!",
          description: "Your task has been published.",
        });
        router.push("/dashboard/tasks");
      }, 2000);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Task</h1>
        <p className="text-muted-foreground">
          Create a new labeling task with image options and SOL rewards.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Enter the details for your new labeling task.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image Classification Task"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please classify the following images into categories..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed instructions for users completing the task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward per User (SOL)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={0.1}
                            max={5}
                            step={0.1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              0.1 SOL
                            </span>
                            <Input
                              type="number"
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                              className="w-20"
                              step={0.1}
                              min={0.1}
                            />
                            <span className="text-sm text-muted-foreground">
                              5 SOL
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Amount of SOL to reward each user who completes the
                        task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Participants</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              1
                            </span>
                            <Input
                              type="number"
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                              className="w-20"
                              step={1}
                              min={1}
                            />
                            <span className="text-sm text-muted-foreground">
                              100
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Maximum number of users who can complete this task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Options</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls) => field.onChange(urls)}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload images for users to label. Minimum 2 images
                      required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Pay & Publish"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Cost:{" "}
              {(form.watch("reward") * form.watch("maxParticipants")).toFixed(
                2
              )}{" "}
              SOL
            </p>
            <p className="text-sm text-muted-foreground">Platform Fee: 0 SOL</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
