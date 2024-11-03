// Primeiro, defina um tipo para os departamentos possíveis
export type Department = 'Industrial Maintenance' | 'ADM. Mat F6';

// Use o tipo para definir o objeto departmentEmails
export const departmentEmails: Record<Department, string[]> = {
  'Industrial Maintenance': ['matheuszwilkdev@gmail.com'],
  'ADM. Mat F6': ['matheuszwilkdev@gmail.com'],
};

export const defaultFrom = 'onboarding@resend.dev';