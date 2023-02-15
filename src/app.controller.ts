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

    console.log(
      `msisdn:-- ${msisdn} SessionID:-- ${sessionid} Inputs:-- ${inputs}`,
    );

    // Get the current state from the session if absent will be null
    let state = await this.sessionProvider.getSessionState(
      sessionid.toString(),
    );
    console.log(`fetched state: ${state}`);

    if (!state) {
      // If the state is null, set the state to home
      state = 'main_menu';
      await this.sessionProvider.setSessionState(sessionid.toString(), state);
    }

    // Split the inputs into an array
    const inputArray = inputs.toString().split('*');
    console.log(`input array: ${inputArray}`);

    // Get the latest input
    const latestInput = inputArray[inputArray.length - 1];
    console.log(`Current Input: ${latestInput}`);

    // Get the current state menu data from the config
    const stateData = await this.sessionProvider.getStateData(
      state,
      this.config,
    );
    const responseText = stateData.text;

    // If the latest input is a number, update the state
    if (latestInput) {
      const nextState = stateData.next[latestInput];
      if (nextState) {
        state = nextState;
        await this.sessionProvider.setSessionState(sessionid.toString(), state);
      }
    } else {
      // state = stateData.next.input;
      state = 'main_menu';
      await this.sessionProvider.setSessionState(sessionid.toString(), state);
      // If it's a dynamic input, process the payment
      console.log('processing payment part b.............');
      // responseText = 'Payment Completed parb b';
      // responseText = this.appService.processPayment(msisdn, sessionid, [latestInput]);
    }
    if (stateData.next.input) {
      // If it's a dynamic input, process the payment
      state = stateData.next.input;
      await this.sessionProvider.setSessionState(sessionid.toString(), state);

      console.log('processing payment part b.............');
      // responseText = this.appService.processPayment(msisdn, sessionid, [latestInput]);
    }

    // // Get the options for the current statestateData
    // const options = stateData.options.join('\n');

    // Return the response text and options1
    return res.contentType('text/plain').send(`${responseText}`);
  }
}
