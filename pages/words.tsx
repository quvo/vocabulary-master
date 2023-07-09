import Head from 'next/head'
import React from 'react';
import { table } from './api/airtable';

export default function Vocabulary({ airtableRecords }) {
  return (
    <div>
      <Head>
        <title>posts from Airtable</title>
      </Head>
      <main>
        <h1>
          Posts
        </h1>
        <div>
          {
            airtableRecords.map((record) =>
              <div style={{margin: 10, padding: 10, border: "solid 1px gray"}} key={record.id}>
                <h2>{record.fields.english}</h2>
                <p>{record.fields.japanese}</p>
                <p>{record.fields.auto_translated_japanese}</p>
              </div>
            )
          }
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps(context) {
  let airtableRecords = await table
    .select({
      maxRecords: 10,
      filterByFormula: 'remembered = FALSE()',
      // sort: [
      //   {field: 'Random', direction: 'desc'},
      // ],
    })
    .firstPage();
  airtableRecords = airtableRecords.map((record) => {
    return {
      id: record.id,
      fields: record.fields,
    }
  });
  return {
    props: {
      airtableRecords: airtableRecords,
    },
  };
}
