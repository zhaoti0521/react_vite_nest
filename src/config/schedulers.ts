export default class Scheduler {
  private max: number;
  private count: number;
  private quene: (() => void)[];
  constructor(max: number) {
    this.max = max;
    this.count = 0;
    this.quene = [];
  }

  async add(promiseCreator: () => Promise<void>): Promise<void> {
    if (this.count >= this.max) {
      await new Promise<void>((resolve) => {
        this.quene.push(resolve);
      });
    }
    this.count++;
    try {
      const res = await promiseCreator();
      return res;
    } finally {
      this.count--;
      if (this.quene.length) {
        this.quene.shift()!();
      }
    }
  }
}
