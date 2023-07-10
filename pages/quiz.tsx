import Head from 'next/head'
import React, {useEffect, useState} from 'react';
import { Text, Button, Card } from "@nextui-org/react";
import {AirtableClient} from "./api/AirtableClient";

export default function Quiz() {
  const [currentVocab, setCurrentValue] = useState(null);
  const [vocabs, setVocabs] = useState(null);
  const client = new AirtableClient();
  const [answerShown, setAnswerShown] = useState(false);
  const getVocabs = async () => {
    const airtableRecords = await client.table
      .select({
        // maxRecords: 30,
        filterByFormula: 'AND(remembered = FALSE(), NOT(english = BLANK()))',
        sort: [
          {field: 'random', direction: 'desc'},
        ],
      })
      .firstPage();
    return airtableRecords.map((record) => {
          return {
            id: record.id,
            fields: record.fields,
          }
        });
  }
  useEffect(() => {
    (async() => {
      const vocabs = await getVocabs();
      setVocabs(vocabs);
      setCurrentValue(vocabs[0])
    })();
  }, []);
  const handleButtonClick = async () => {
    const index = vocabs.indexOf(currentVocab);
    setCurrentValue(vocabs[index +1]);
    handleAnswerShown();
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

  const handleAnswerShown = () => {
    setAnswerShown(!answerShown);
  }
  return (
    <div>
      <Head>
        <title>Vocabulary</title>
      </Head>
      <main>
        <Text h1>
          Vocabulary
        </Text>
        {!!currentVocab &&
        <div style={{padding: 10}}>
          <Card style={{padding: 30}}>
            <div key={currentVocab.id}>
              <Text h2 color="">{currentVocab.fields.english}</Text>
              {answerShown ?
              <>
                <Text h5>{currentVocab.fields.japanese}</Text>
                <Text h5>{currentVocab.fields.auto_translated_japanese}</Text>
              </>
              : <>
                <Button onClick={handleAnswerShown}>
                  回答を見る
                </Button>
                </>
              }
            </div>
          </Card>
          <div className="action-button">
            <Button color="success" onClick={handleCheck}>
              覚えた
            </Button>
            <Button color="warning" onClick={handleButtonClick}>
              覚えてない
            </Button>
          </div>
        </div>
        }
      </main>
    </div>
  )
}
