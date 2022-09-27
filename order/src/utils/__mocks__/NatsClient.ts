export const natsClient = {
  stan: {
    publish: (subject: string, data: string, cb: () => void) => {
      cb();
    },
  },
};
