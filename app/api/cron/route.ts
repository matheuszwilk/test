import { startScheduler } from '@/app/_actions/email/scheduler';
import { NextResponse } from 'next/server';

// Inicia o agendador quando a API inicializar
startScheduler();

export async function GET() {
  return NextResponse.json({ status: 'Scheduler is running' });
} 