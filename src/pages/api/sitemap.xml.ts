import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';

const siteUrl = process.env.SITE_URL || 'https://your-domain.com';

function generateSiteMap(tools: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${tools
        .map((tool) => {
          return `
            <url>
              <loc>${`${siteUrl}/tool/${tool._id}`}</loc>
              <lastmod>${new Date(tool.updatedAt).toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/xml');
  
  try {
    await dbConnect();
    const tools = await AITool.find({}).select('_id updatedAt');
    const sitemap = generateSiteMap(tools);
    res.write(sitemap);
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}