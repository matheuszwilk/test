import cron from 'node-cron';
import { sendAndonNotifications } from './andon-email-notification';

let schedulerStarted = false;

export function startScheduler() {
  if (schedulerStarted) {
    console.log('Scheduler já está rodando. Ignorando nova inicialização.');
    return;
  }

  // Agenda para rodar todos os dias às 9:00
  cron.schedule('32 11 * * *', async () => {
    console.log('Iniciando envio de notificações Andon...');
    await sendAndonNotifications();
    console.log('Notificações Andon enviadas com sucesso!');
  });

  schedulerStarted = true;
  console.log('Scheduler iniciado com sucesso!');
}