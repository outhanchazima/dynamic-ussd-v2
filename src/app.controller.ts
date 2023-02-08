import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('ussd')
export class AppController {
  private config = require('/home/outhan/my_code/dynamic-ussd/config.json');

  @Get()
  handleUssdRequest(@Req() req: Request, @Res() res: Response) {
    const { msisdn, sessionid, inputs } = req.query;

    console.log('msisdn: ', msisdn);
    console.log('sessionId: ', sessionid);
    console.log('inputs: ', inputs);

    const inputArray = String(inputs).split('*');
    let currentPage = 'home';
    let response = '';

    console.log('inputArray: ', inputArray);

    for (const input of inputArray) {
      const page = this.config[currentPage];
      response += page.text + '\n';

      if (page.options.length > 0) {
        for (const [index, option] of page.options.entries()) {
          response += `${index + 1}. ${option}\n`;
        }
        currentPage = page.next[input];
      } else {
        // this is an input page, process the input and move to the next page
        // ...
        currentPage = page.next.input;
      }
    }

    return res.contentType('text/plain').send(response);
  }
}
