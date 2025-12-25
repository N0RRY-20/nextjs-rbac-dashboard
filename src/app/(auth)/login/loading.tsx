import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginLoading() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Logo skeleton */}
        <div className="flex items-center gap-2 self-center">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Card skeleton */}
        <Card>
          <CardHeader className="text-center space-y-2">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social buttons */}
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />

            {/* Separator */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-px flex-1" />
            </div>

            {/* Form fields */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Submit button */}
            <Skeleton className="h-10 w-full" />

            {/* Sign up link */}
            <Skeleton className="h-4 w-40 mx-auto" />
          </CardContent>
        </Card>

        {/* Terms */}
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  );
}
