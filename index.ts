import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import axios from 'axios';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1927222',
  key: '27991ede2e5f0b8d86d9',
  secret: '7efe542d0a2afbabb3c4',
  cluster: 'eu',
});

const app = new Elysia();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_BASE_URL = 'https://api-free.deepl.com/v2/translate';

interface SendMessageBody {
  channel: string;
  source_lang: string;
  target_lang: string;
  message: string;
}

// app.use(cors());
app.post('/send-message', async ({ body }: { body: SendMessageBody }) => {
  const { channel, source_lang, target_lang, message } = body;

  try {
    const response = await axios.post(DEEPL_BASE_URL, null, {
      params: {
        auth_key: DEEPL_API_KEY,
        text: message,
        source_lang, // es. 'IT'
        target_lang, // es. 'ES'
      }
    });

    const translatedMessage = response.data.translations[0].text;

    await pusher.trigger(channel, 'new-message', { message: translatedMessage });

    return { translatedMessage };
  } catch (error) {
    return { error };
  }
});

export default app
