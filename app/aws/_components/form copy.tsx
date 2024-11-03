"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from "@/app/_components/ui/file-upload";
import { formSchema, type FormSchema } from "../schema";
import { submitFormAction } from "../actions";
import { toast } from "sonner";

export function UploadForm() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined
    }
  });

  async function onSubmit(values: FormSchema) {
    try {
      if (!files?.[0]) {
        form.setError("file", {
          message: "No file provided"
        });
        return;
      }

      if (files[0].size === 0) {
        form.setError("file", {
          message: "File cannot be empty"
        });
        return;
      }

      if (files[0].size > 300 * 1024 * 1024) {
        form.setError("file", {
          message: "File size must be less than 300MB"
        });
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", files[0]);
      
      console.log("Submitting file:", files[0]);

      const result = await submitFormAction({
        url: "",
        errors: undefined
      }, formData);

      if (result.errors) {
        form.setError("file", {
          message: result.errors.file
        });
      } else if (result.url) {
        setUploadedUrl(result.url);
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Form submission error", error);
      form.setError("file", {
        message: "Failed to upload file. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center space-y-4 p-6">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Upload File *</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={(newFiles) => {
                        setFiles(newFiles);
                        if (newFiles?.[0]) {
                          field.onChange(newFiles[0]);
                        }
                      }}
                      dropzoneOptions={{
                        maxSize: 300 * 1024 * 1024,
                        accept: {
                          'application/pdf': ['.pdf'],
                          'application/vnd.ms-powerpoint': ['.ppt'],
                          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
                          'application/vnd.ms-excel': ['.xls'],
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                          'text/csv': ['.csv']
                        }
                      }}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full">
                          <CloudUpload className="text-gray-500 w-10 h-10" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            File size must be less than 300MB
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current flex-shrink-0" />
                              <span className="truncate max-w-[calc(100%-2rem)] mr-2">
                                {file.name.length > 30 
                                  ? `${file.name.substring(0, 30)}...`
                                  : file.name}
                              </span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormDescription>Select a file to upload.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={!files?.length || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload file'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
