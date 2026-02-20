# Notion API Quickstart Guide

## Requirements

- Notion account (free)
- Quotes Database (copy or create your own)
- Scriptable App for iOS
- Your Notion Database ID
- Your Notion Integration API Token


## Step 1: Create a Notion Integration (API Token)

1. Go to [Notion Developers: My Integrations](https://www.notion.so/my-integrations).
2. Click **+ New integration**.
3. Name your integration (e.g., `Book Quotes Widget`).
4. Select your workspace.
5. Click **Submit**.
6. Copy the **Internal Integration Token**.


## Step 2: Share Your Database With the Integration

1. Open your Notion database.
2. Click **Share** at the top right.
3. Add your integration by name (give it full access).

## Step 3: Find Your Database ID

1. Open your database as a full page in Notion.
2. Copy the URL. The Database ID is the long string after the last dash (`-`).
   - Example: `abcdef1234567890abcdef1234567890`


## Step 4: Add the Script to Scriptable

1. Copy the code below into a new script in Scriptable.
2. Replace `YOUR_DATABASE_ID` and `YOUR_SECRET_TOKEN` with your values.

```javascript
// Notion settings
const databaseID = 'YOUR_DATABASE_ID';
const token = 'YOUR_SECRET_TOKEN';
const notionVersion = '2022-06-28';
const notionApi = `https://api.notion.com/v1/databases/${databaseID}/query`;

// Main function
(async () => {
  let quote = await readNotionQuote();
  if (!quote) {
    console.log('No quote found');
    return;
  }
  let widget = await createWidget(quote.text, quote.author, quote.book, quote.tags);
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    await widget.presentMedium();
  }
  Script.complete();
})();

async function readNotionQuote() {
  let req = new Request(notionApi);
  req.method = 'POST';
  req.headers = {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": notionVersion,
    "Content-Type": "application/json"
  };
  req.body = JSON.stringify({
    page_size: 100
  });
  let res = await req.loadJSON();
  
  if (!res.results || res.results.length === 0) {
    return null;
  }
  let quotes = res.results.map(page => {
    let quoteText = '';
    if (page.properties.title && Array.isArray(page.properties.title.title)) {
      quoteText = page.properties.title.title.map(t => t.plain_text).join('');
    } else if (page.properties.Quote && Array.isArray(page.properties.Quote.title)) {
      quoteText = page.properties.Quote.title.map(t => t.plain_text).join('');
    }
    
    let authorName = page.properties.Author?.select?.name || '';
    let bookTitle = page.properties.Book?.select?.name || '';
    let rating = (page.properties.Rating?.select?.name || '').length;
    let tags = page.properties.Tags?.multi_select?.map(tag => tag.name) || [];
    return {
      text: quoteText,
      author: authorName,
      book: bookTitle,
      rating: rating,
      tags: tags
    };
  }).filter(quote => quote.text.trim() !== '' && quote.author.trim() !== '');
  
  if (quotes.length === 0) {
    return null;
  }
  
  // Weighted random selection based on rating
  let totalWeight = quotes.reduce((sum, quote) => sum + Math.pow(2, quote.rating), 0);
  let randomWeight = Math.random() * totalWeight;
  let weightSum = 0;
  
  for (let quote of quotes) {
    weightSum += Math.pow(2, quote.rating);
    if (weightSum > randomWeight) {
      return quote;
    }
  }
  
  // Fallback to random selection if something goes wrong
  return quotes[Math.floor(Math.random() * quotes.length)];
}

async function createWidget(text, author, book, tags) {
  let widget = new ListWidget();
  widget.backgroundColor = new Color("#1C1C1E");

  let quoteText = widget.addText(`"${text}"`);
  quoteText.centerAlignText();
  quoteText.font = Font.boldSystemFont(16);
  quoteText.textColor = new Color("#FFFFFF");
  quoteText.minimumScaleFactor = 0.5;

  widget.addSpacer(8);

  let authorText = widget.addText(`- ${author}`);
  authorText.centerAlignText();
  authorText.font = Font.boldSystemFont(14);
  authorText.textColor = new Color("#AAAAAA");
  authorText.minimumScaleFactor = 0.5;

  if (book) {
    widget.addSpacer(4);
    let bookText = widget.addText(book);
    bookText.centerAlignText();
    bookText.font = Font.italicSystemFont(12);
    bookText.textColor = new Color("#AAAAAA");
    bookText.minimumScaleFactor = 0.5;
  }

  if (tags.length > 0) {
    widget.addSpacer(4);
    let tagsText = widget.addText(`Tags: ${tags.join(', ')}`);
    tagsText.centerAlignText();
    tagsText.font = Font.systemFont(12);
    tagsText.textColor = new Color("#888888");
    tagsText.minimumScaleFactor = 0.5;
  }

  widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 60);
  return widget;
}
```

## Troubleshooting

- Check your Database ID, Secret Token, and Database Field Names.
- Make sure your database is connected to the correct integration.
- If you see "No Quote Found," check your field names and database setup.