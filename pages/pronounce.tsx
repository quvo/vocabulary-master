import { Button } from "@nextui-org/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { AirtableClient } from "./api/AirtableClient";
import { shutfleArray } from "./api/util";
export default function Pronounce() {
  const [vocabs, setVocabs] = useState([]);
  const client = new AirtableClient();
  const getVocabs = async () => {
    const airtableRecords = await client.table
      .select({
        maxRecords: 300,
        filterByFormula:
          "AND(remembered = FALSE(), NOT(ja_pronounce_gcs_url = BLANK()), NOT(en_pronounce_gcs_url = BLANK()))",
        sort: [{ field: "random", direction: "desc" }],
      })
      .all();
    const vocabs = airtableRecords.map((record) => record.fields);
    const randomedRecords = shutfleArray(vocabs);
    setVocabs(randomedRecords);
  };

  useEffect(() => {
    (async () => {
      await getVocabs();
    })();
  }, []);

  const play = async (vocab, audio, isEnglish: boolean) => {
    if (isEnglish) {
      audio.src = vocab.en_pronounce_gcs_url;
    } else {
      audio.src = vocab.ja_pronounce_gcs_url;
    }
    await audio.play();
  };

  const playRoutine = () => {
    const audio = new Audio();
    audio.style.width = "100%";
    audio.style.height = "auto";
    audio.controls = true;
    audio.volume = 0.5;
    let index = 0;

    let isEnglish = true;
    audio.addEventListener("ended", function () {
      const vocab = vocabs[index];
      if (index < vocabs.length) {
        play(vocab, audio, isEnglish);
        if (!isEnglish) {
          index++;
        }
      } else {
        index++;
        play(vocabs[0], audio, isEnglish);
        index = 0;
      }
      isEnglish = !isEnglish;
    });
    play(vocabs[0], audio, true);
  };

  return (
    <>
      <div>
        <Head>
          <title>Vocabulary</title>
        </Head>
        <main>
          <Button onPress={playRoutine}>再生</Button>
        </main>
      </div>
    </>
  );
}
