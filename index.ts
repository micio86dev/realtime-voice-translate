import { Elysia } from 'elysia';
import axios from 'axios';

const app = new Elysia();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const BASE_URL = 'https://api-free.deepl.com/v2/translate';

app.post('/translate', async (ctx) => {
  const { text, targetLang } = ctx.body;

  try {
    const response = await axios.post(BASE_URL, null, {
      params: {
        auth_key: DEEPL_API_KEY,
        text: text,
        target_lang: targetLang.toUpperCase() // DeepL richiede il codice lingua in maiuscolo (es. 'EN', 'IT')
      }
    });

    return { translatedText: response.data.translations[0].text };
  } catch (error) {
    console.error('Errore nella traduzione:', error);
    return { error: 'Errore nella traduzione' };
  }
});

app.listen(3000);
