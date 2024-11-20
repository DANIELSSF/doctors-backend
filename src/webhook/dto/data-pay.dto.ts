
export class DataPay {
    event:       string;
    data:        Data;
    sent_at:     Date;
    timestamp:   number;
    signature:   Signature;
    environment: string;
}

export class Data {
    transaction: Transaction;
}

export class Transaction {
    id:                  string;
    created_at:          Date;
    finalized_at:        Date;
    amount_in_cents:     number;
    reference:           string;
    customer_email:      string;
    currency:            string;
    payment_method_type: string;
    payment_method:      PaymentMethod;
    status:              string;
    status_message:      null;
    shipping_address:    null;
    redirect_url:        string;
    payment_source_id:   null;
    payment_link_id:     null;
    customer_data:       CustomerData;
    billing_data:        null;
}

export class CustomerData {
    full_name:    string;
    phone_number: string;
}

export class PaymentMethod {
    type:                       string;
    extra:                      Extra;
    user_type:                  number;
    user_legal_id:              string;
    user_legal_id_type:         string;
    payment_description:        string;
    financial_institution_code: string;
}

export class Extra {
    ticket_id:            string;
    is_three_ds:          boolean;
    return_code:          string;
    request_date:         Date;
    async_payment_url:    string;
    traceability_code:    string;
    transaction_cycle:    string;
    transaction_state:    null;
    three_ds_auth_type:   null;
    external_identifier:  string;
    bank_processing_date: Date;
}

export class Signature {
    checksum:   string;
    properties: string[];
}
