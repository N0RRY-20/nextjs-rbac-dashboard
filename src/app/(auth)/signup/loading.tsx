import { Skeleton } from "@/components/ui/skeleton";

export default function SignupLoading() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo skeleton */}
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Form skeleton */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-1 text-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-10 w-full" />

            {/* Separator */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-px flex-1" />
            </div>

            {/* Social button */}
            <Skeleton className="h-10 w-full" />

            {/* Sign in link */}
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="bg-muted relative hidden lg:block">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
    </div>
  );
}
