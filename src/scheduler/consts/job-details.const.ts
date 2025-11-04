import { EQueue } from '../enums/queue.enum';

export const jobDetails: Record<EQueue, { name: string; id?: string }> = {
  [EQueue.test]: {
    name: 'run-test-job',
    id: 'test-job-scheduler',
  },
  [EQueue.delayed]: {
    name: 'run-delayed-job',
  },
};
