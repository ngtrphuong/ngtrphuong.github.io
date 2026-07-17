/**
 * RSS feed: /feed.xml
 */
import rss from '@astrojs/rss';
import { getAllPosts, getPostDate, postUrlFromSlug } from '@utils/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  const SITE = context.site?.toString().replace(/\/$/, '') ?? 'https://ngtrphuong.github.io';

  return rss({
    title: 'Phuong Nguyen Blog',
    description: 'Blog and tools by Phuong Nguyen (ngtrphuong)',
    site: SITE,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: getPostDate(post),
      link: `${SITE}${postUrlFromSlug(post.id)}`,
    })),
    customData: '<language>en-us</language>',
  });
}
