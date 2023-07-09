import {Table} from "airtable";

const Airtable = require('airtable');
export class AirtableClient {
  table: Table<any>;
  constructor() {
    const base = new Airtable({ apiKey: 'keyD4dDpfWYPoVSpq' }).base(
      'appyeocwQxg9S6tPJ'
    );
    this.table = base.table('master');
  }

}
