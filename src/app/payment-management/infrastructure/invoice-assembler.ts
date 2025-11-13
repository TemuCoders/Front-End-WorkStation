import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Invoice, InvoiceLine } from '../domain/model/invoice.entity';
import { InvoiceResource, InvoiceLineResource } from './invoice-resource';
import { InvoiceResponse } from './invoice-response';

export class InvoiceAssembler implements BaseAssembler<Invoice, InvoiceResource, InvoiceResponse> {

  toEntityFromResource(resource: InvoiceResource): Invoice {
    const invoice = new Invoice();
    invoice.id = resource.id;
    invoice.invoiceNumber = resource.invoiceNumber;
    invoice.bookingId = resource.bookingId;
    invoice.userId = resource.userId;
    invoice.currency = resource.currency;
    invoice.subtotal = resource.subtotal;
    invoice.tax = resource.tax;
    invoice.total = resource.total;
    invoice.status = resource.status as any;
    invoice.issuedAt = resource.issuedAt;
    invoice.sentAt = resource.sentAt;
    invoice.lines = resource.lines.map(line => this.toLineEntity(line));
    invoice.createdAt = resource.createdAt;
    invoice.updatedAt = resource.updatedAt;
    return invoice;
  }

  toResourceFromEntity(entity: Invoice): InvoiceResource {
    return {
      id: entity.id,
      invoiceNumber: entity.invoiceNumber,
      bookingId: entity.bookingId,
      userId: entity.userId,
      currency: entity.currency,
      subtotal: entity.subtotal,
      tax: entity.tax,
      total: entity.total,
      status: entity.status,
      issuedAt: entity.issuedAt,
      sentAt: entity.sentAt,
      lines: entity.lines.map(line => this.toLineResource(line)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntitiesFromResponse(response: InvoiceResponse): Invoice[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }

  private toLineEntity(resource: InvoiceLineResource): InvoiceLine {
    const line = new InvoiceLine();
    line.id = resource.id;
    line.description = resource.description;
    line.quantity = resource.quantity;
    line.unitAmount = resource.unitAmount;
    line.tax = resource.tax;
    line.subtotal = resource.subtotal;
    line.total = resource.total;
    return line;
  }

  private toLineResource(entity: InvoiceLine): InvoiceLineResource {
    return {
      id: entity.id,
      description: entity.description,
      quantity: entity.quantity,
      unitAmount: entity.unitAmount,
      tax: entity.tax,
      subtotal: entity.subtotal,
      total: entity.total
    };
  }
}
