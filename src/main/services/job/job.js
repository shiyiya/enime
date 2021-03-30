export default class Job {
  constructor(props) {
    if (new.target === Job) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  name() {
    throw Error("The job name cannot be null");
  }

  cron() {
    throw Error("The cron need an implementation");
  }

  async run() {

  }
}

const jobs = [];

export function getJobs() {
  return jobs;
}

export function register(job) {
  jobs.push(job);
}
