import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigProvider } from './providers/config.provider';
import { SessionProvider } from './providers/session,provider';

@Controller('ussd')
export class AppController {
  private config;

  constructor(
    private sessionProvider: SessionProvider,
    private configProvider: ConfigProvider,
  ) {
    this.config = this.configProvider.getConfig();
  }

  @Get()
  public async handleUssdRequest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<string>> {
    const { msisdn, sessionid, inputs } = req.query;

    console.log('msisdn: ', msisdn);
    console.log('sessionId: ', sessionid);
    console.log('inputs: ', inputs);

    // VERSION 2 BELLOW
    // Get the current state from the session
    let state = await this.sessionProvider.getSessionState(
      sessionid.toString(),
    );
    if (!state) {
      state = 'home';
      await this.sessionProvider.setSessionState(sessionid.toString(), state);
    }

    // Split the inputs into an array
    const inputArray = inputs.toString().split('*');

    // Get the latest input
    const latestInput = inputArray[inputArray.length - 1];

    // Get the current state data from the config
    const stateData = await this.sessionProvider.getStateData(
      state,
      this.config,
    );
    let responseText = stateData.text;

    // If the latest input is a number, update the state
    if (Number.isInteger(parseInt(latestInput))) {
      const nextState = stateData.next[latestInput];
      if (nextState) {
        state = nextState;
        await this.sessionProvider.setSessionState(sessionid.toString(), state);
      }
    } else if (latestInput === 'input') {
      // If the latest input is 'input', process the payment
      console.log('processing payment.............');
      responseText = 'Payment Completed';
      // responseText = this.appService.processPayment(msisdn, sessionid, inputArray);
    }

    // Get the options for the current state
    const options = stateData.options.join('\n');

    // Return the response text and options
    return res.contentType('text/plain').send(`${responseText}\n${options}`);
  }

  // VERSION 1 BELLOW
  // const inputArray = String(inputs).split('*');
  // let currentPage = 'home';
  // let response = '';

  // console.log('inputArray: ', inputArray);

  // for (const input of inputArray) {
  //   const page = this.config[currentPage];
  //   console.log('The current page is: ', page);
  //   response += page.text + '\n';

  //   if (page.options.length > 0) {
  //     for (const [index, option] of page.options.entries()) {
  //       response += `${option}\n`;
  //     }
  //     currentPage = page.next[input];
  //   } else {
  //     // this is an input page, process the input and move to the next page
  //     // ...
  //     currentPage = page.next.input;
  //   }
  // }
  // console.log('new currentPage', currentPage);
  // console.log('input',)

  // return res.contentType('text/plain').send(response);
}
