import Head from 'next/head'
import React, {useEffect, useState} from 'react';
import {AirtableClient} from "./api/AirtableClient";

export default function Quiz({ airtableRecords }) {
  const [currentVocab, setCurrentValue] = useState(null);
  const client = new AirtableClient();
  useEffect(() => {
    (async() => {
      console.log(airtableRecords[0]);
      setCurrentValue(airtableRecords[0])
    })();
  }, []);
  const handleButtonClick = async () => {
    const index = airtableRecords.indexOf(currentVocab);
    setCurrentValue(airtableRecords[index +1]);
    await client.table.update([
      {id: currentVocab.id, fields: {'random': Math.random()}},
    ]);
  }
  const handleCheck = async () => {
    await client.table.update([
      {id: currentVocab.id, fields: {'remembered': true}},
    ]);
    await handleButtonClick();
  }
  return (
    <div>
      <Head>
        <title>posts from Airtable</title>
      </Head>
      <main>
        <h1>
          Posts
        </h1>
        {!!currentVocab &&
        <>
          <div>
            <div style={{margin: 10, padding: 10, border: "solid 1px gray"}} key={currentVocab.id}>
              <h2>{currentVocab.fields.english}</h2>
              <p>{currentVocab.fields.japanese}</p>
              <p>{currentVocab.fields.auto_translated_japanese}</p>
            </div>
          </div>
          <button onClick={handleCheck}>
            覚えた
          </button>
          <button onClick={handleButtonClick}>
            覚えてない
          </button>
        </>
        }
      </main>
    </div>
  )
}

export async function getStaticProps(context) {
  const client = new AirtableClient();
  let airtableRecords = await client.table
    .select({
      // maxRecords: 30,
      filterByFormula: 'AND(remembered = FALSE(), NOT(english = BLANK()))',
      sort: [
        {field: 'random', direction: 'desc'},
      ],
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
