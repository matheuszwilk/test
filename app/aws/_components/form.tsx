"use client";

import { useFormState } from "react-dom";
import { submitFormAction } from "@/app/aws/actions";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";

const initialState = {
  url: "",
};

export function UploadForm() {
  const [state, formAction] = useFormState(submitFormAction, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <form
          action={formAction}
          className="flex flex-col items-center justify-center space-y-4 p-6"
        >
          <Input type="file" name="file" id="file" className="cursor-pointer" />
          <Button type="submit" className="w-full">
            Upload file
          </Button>

          {state.url && (
            <>
              <Separator />

              <p className="break-all text-sm text-muted-foreground">
                {state.url}
              </p>

              {state.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                // Using an img tag instead of next/image since the image is from an external URL
                // that isn't configured in next.config.js
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={state.url}
                  alt="Uploaded image"
                  width={400}
                  height={300}
                  className="rounded-lg object-contain"
                />
              )}
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}