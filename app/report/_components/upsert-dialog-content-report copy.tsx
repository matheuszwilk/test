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
import { UploadForm } from "@/app/aws/_components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      // setDialogIsOpen(false);
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

  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const onSubmit = async (data: UpsertAndonReportDataSchema) => {
    try {
      executeUpsertReport({ 
        ...data,
        id: defaultValues?.id,
        action_plan_file_url: uploadedFileUrl
      });
    } catch (error) {
      console.error("Error during report update:", error);
      toast.error("Ocorreu um erro ao salvar o relatório");
    }
  };

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                <FormControl>
                  <UploadForm />
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
              disabled={form.formState.isSubmitting}
              className="gap-1.5"
            >
              {form.formState.isSubmitting && (
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
