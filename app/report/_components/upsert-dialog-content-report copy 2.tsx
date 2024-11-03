"use client";

import { updateAndonReport } from "@/app/_actions/andon/upsert-andon";
import { upsertAndonReportDataSchema, UpsertAndonReportDataSchema } from "@/app/_actions/andon/upsert-andon/schemas";
import { Button } from "@/app/_components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { CloudUpload, Paperclip, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from "@/app/_components/ui/file-upload";
import { submitFormAction } from "@/app/aws/actions";
import { formSchema, formStateSchema } from "@/app/aws/schema";

interface UpsertReportDialogContentProps {
  defaultValues?: UpsertAndonReportDataSchema;
  setDialogIsOpen: Dispatch<SetStateAction<boolean>>;
}

const UpsertReportDialogContent = ({
  defaultValues,
  setDialogIsOpen,
}: UpsertReportDialogContentProps) => {
  const { execute: executeUpsertReport } = useAction(updateAndonReport, {
    onSuccess: () => {
      toast.success("Relatório salvo com sucesso.");
      setDialogIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Ocorreu um erro ao salvar o relatório: ${error}`);
    },
  });

  const form = useForm<UpsertAndonReportDataSchema>({
    shouldUnregister: true,
    resolver: zodResolver(upsertAndonReportDataSchema),
    defaultValues: defaultValues ?? {
      id: "",
      year_month: null,
      andon_process: null,
      equipment_line: null,
      reason: null,
      end_date: null,
      cause_department: null,
      andon_time: null,
      createdat: null,
      status: null,
      action_plan_file_url: null
    },
  });

  const [files, setFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    try {
      if (!files?.[0]) {
        toast.error("Nenhum arquivo selecionado");
        return null;
      }

      const validationResult = formSchema.safeParse({ file: files[0] });
      
      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return null;
      }

      setIsUploading(true);

      const formData = new FormData();
      const timestamp = Date.now();
      const originalName = files[0].name;
      // Replace spaces with hyphens in filename
      const formattedName = originalName.replace(/\s+/g, '-');
      const renamedFile = new File([files[0]], `${timestamp}-${formattedName}`, {
        type: files[0].type
      });
      formData.append("file", renamedFile);
      
      console.log("Submitting file:", renamedFile);

      const result = await submitFormAction({
        url: "",
        errors: undefined
      }, formData);

      const parsedResult = formStateSchema.safeParse(result);
      
      if (!parsedResult.success) {
        toast.error("Formato de resposta inválido");
        return null;
      }

      if (parsedResult.data.errors) {
        toast.error(parsedResult.data.errors.file);
        return null;
      }

      if (parsedResult.data.url) {
        toast.success("Arquivo enviado com sucesso!");
        return parsedResult.data.url;
      }

      return null;
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      toast.error("Falha ao enviar arquivo");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: UpsertAndonReportDataSchema) => {
    try {
      let fileUrl = data.action_plan_file_url;
      
      if (files) {
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) {
          return;
        }
        fileUrl = uploadedUrl;
      }

      executeUpsertReport({ 
        ...data,
        id: defaultValues?.id,
        action_plan_file_url: fileUrl || null
      });
    } catch (error) {
      console.error("Error during report update:", error);
      toast.error("Ocorreu um erro ao salvar o relatório");
    }
  };

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Editar Relatório</DialogTitle>
            <DialogDescription>Preencha os dados do relatório abaixo</DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="year_month"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Mês/Ano</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YYYY" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="andon_process"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo Andon</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o processo" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipment_line"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Linha de Equipamento</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a linha" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o motivo" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Data Final</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cause_department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento Causador</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o departamento" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="andon_time"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Tempo Andon</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Digite o tempo" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o status" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="action_plan_file_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano de Ação</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={(newFiles) => {
                      setFiles(newFiles);
                      if (newFiles?.[0]) {
                        field.onChange(null);
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
                          <span className="font-semibold">Clique para enviar</span>
                          &nbsp; ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Arquivo deve ser menor que 300MB
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
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="reset">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isUploading}
              className="gap-1.5"
            >
              {(form.formState.isSubmitting || isUploading) && (
                <Loader2Icon className="animate-spin" size={16} />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertReportDialogContent;
