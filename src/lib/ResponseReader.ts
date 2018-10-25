import { Readable } from 'stream';

class ResponseReader extends Readable {
  response: Response;
  busy: boolean = false;

  constructor(response: Response) {
    super();
    this.response = response;
  }

  // tslint:disable-next-line:function-name
  async _read() {
    if (this.busy) {
      return;
    }

    this.busy = true;

    await this.response.text()
      .then((responseText) => {
        this.push(responseText);
        this.push(null);
        this.busy = false;
      });
  }
}

export default ResponseReader;
