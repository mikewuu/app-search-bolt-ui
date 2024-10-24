import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
const SCRAPINGBEE_URL = 'https://app.scrapingbee.com/api/v1';

interface ProductHuntPost {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  votes: number;
  comments: number;
}

export async function scrapeProductHunt(): Promise<ProductHuntPost[]> {
  try {
    const response = await axios.get(SCRAPINGBEE_URL, {
      params: {
        api_key: SCRAPINGBEE_API_KEY,
        url: 'https://www.producthunt.com',
        render_js: 'false',
      },
    });

    const $ = cheerio.load(response.data);
    const posts: ProductHuntPost[] = [];

    // Product Hunt's main feed items
    $('[data-test="product-item"]').each((_, element) => {
      const $el = $(element);
      
      const post: ProductHuntPost = {
        id: $el.attr('id') || Math.random().toString(36).substr(2, 9),
        title: $el.find('[data-test="product-name"]').text().trim(),
        description: $el.find('[data-test="product-description"]').text().trim(),
        url: 'https://producthunt.com' + $el.find('a[data-test="product-url"]').attr('href'),
        thumbnail: $el.find('img[data-test="product-thumbnail"]').attr('src') || '',
        votes: parseInt($el.find('[data-test="vote-button"] span').text()) || 0,
        comments: parseInt($el.find('[data-test="comment-count"]').text()) || 0,
      };

      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error('Error scraping Product Hunt:', error);
    throw error;
  }
}