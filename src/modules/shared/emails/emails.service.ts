import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { EmailInfo } from './interfaces/email-info.interface';

@Injectable()
export class EmailsService {
  private mailConfig = {};
  private transporter: nodemailer.Transporter;
  constructor(configService: ConfigService) {
    this.mailConfig = {
      pool: true,
      host: 'smtp.googlemail.com',
      port: 465,
      secure: true,
      auth: {
        user: configService.getOrThrow('MAIL_ACCOUNT'),
        pass: configService.getOrThrow('MAIL_PASSWORD'),
      },
    };
    this.transporter = nodemailer.createTransport(this.mailConfig);
  }

  async sendEmail(info: EmailInfo) {
    try {
      const source = fs.readFileSync(
        `${__dirname}/templates/${info.templateName}.hbs`,
        'utf8',
      );
      const compiledTemplate = Handlebars.compile(source);
      const result = await this.transporter.sendMail({
        from: '"ProductStore" <administration@product-store.dz>',
        to: info.to,
        cc: info.cc,
        subject: info.subject,
        html: compiledTemplate(info.context),
      });
      return result;
    } catch (err) {
      console.error(err);
    }
  }
}
