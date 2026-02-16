/**
 * Twitter Mock API Server
 * 
 * This server simulates Twitter API endpoints for testing the Postman collection.
 * 
 * INSTRUCTIONS:
 * 1. Save this file as "twitter-mock-server.js"
 * 2. Open terminal/command prompt
 * 3. Navigate to the folder where you saved this file: cd path/to/folder
 * 4. Run: node twitter-mock-server.js
 * 5. Keep the terminal open while testing in Postman
 * 6. In Postman, set baseUrl to: http://localhost:3000
 */

const http = require('http');
const url = require('url');
const port = 3000;

console.log('========================================');
console.log('Twitter Mock API Server');
console.log('========================================');
console.log('');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Helper function to send JSON response
  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
  };

  // Handle OPTIONS for CORS
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  console.log(`${method} ${pathname}`);

  // POST /v2/tweets - Post new tweet
  if (method === 'POST' && pathname === '/v2/tweets') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const tweetText = requestData.text;
        const tweetId = '1234567890123456789'; // 19 digit string
        const createdAt = new Date().toISOString();
        
        console.log(`  ✓ Created tweet: "${tweetText}"`);
        
        sendJSON(201, {
          data: {
            id: tweetId,
            text: tweetText,
            created_at: createdAt,
            public_metrics: {
              retweet_count: 0,
              like_count: 0,
              reply_count: 0,
              quote_count: 0
            }
          }
        });
      } catch (error) {
        sendJSON(400, { error: 'Invalid JSON' });
      }
    });
  }
  // GET /v2/users/by/username/:username/tweets - Get user timeline
  else if (method === 'GET' && pathname.startsWith('/v2/users/by/username/') && pathname.endsWith('/tweets')) {
    const username = pathname.split('/')[5];
    console.log(`  ✓ Fetched timeline for: ${username}`);
    
    sendJSON(200, {
      data: [
        {
          id: '1234567890123456780',
          text: 'First tweet from user timeline',
          created_at: '2026-02-06T09:00:00.000Z',
          public_metrics: {
            retweet_count: 5,
            like_count: 10,
            reply_count: 2,
            quote_count: 1
          }
        },
        {
          id: '1234567890123456781',
          text: 'Second tweet from user timeline',
          created_at: '2026-02-06T08:00:00.000Z',
          public_metrics: {
            retweet_count: 3,
            like_count: 7,
            reply_count: 1,
            quote_count: 0
          }
        },
        {
          id: '1234567890123456782',
          text: 'Third tweet from user timeline',
          created_at: '2026-02-06T07:00:00.000Z',
          public_metrics: {
            retweet_count: 8,
            like_count: 15,
            reply_count: 4,
            quote_count: 2
          }
        }
      ],
      meta: {
        result_count: 3,
        next_token: 'abc123'
      }
    });
  }
  // GET /v1.1/trends/place.json - Get trending topics
  else if (method === 'GET' && pathname === '/v1.1/trends/place.json') {
    console.log('  ✓ Fetched trending topics');
    
    sendJSON(200, {
      data: [
        {
          hashtag: '#TrendingNow',
          tweet_volume: 125000,
          trend_rank: 1
        },
        {
          hashtag: '#ViralContent',
          tweet_volume: 98500,
          trend_rank: 2
        },
        {
          hashtag: '#SocialMedia',
          tweet_volume: 87200,
          trend_rank: 3
        },
        {
          hashtag: '#Technology',
          tweet_volume: 76300,
          trend_rank: 4
        },
        {
          hashtag: '#Innovation',
          tweet_volume: 65400,
          trend_rank: 5
        },
        {
          hashtag: '#Digital',
          tweet_volume: 54100,
          trend_rank: 6
        }
      ]
    });
  }
  // GET /v2/users/analytics - Get analytics data
  else if (method === 'GET' && pathname === '/v2/users/analytics') {
    console.log('  ✓ Fetched analytics data');
    
    sendJSON(200, {
      data: {
        tweet_impressions: 1250000,
        profile_visits: 45600,
        follower_count: 12340,
        date_range: {
          start: '2026-01-01',
          end: '2026-02-06'
        }
      }
    });
  }
  // 404 Not Found
  else {
    console.log('  ✗ Not found');
    sendJSON(404, { error: 'Not Found' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`✓ Server running on http://127.0.0.1:${port}`);
  console.log('✓ Ready to accept requests from Postman');
  console.log('');
  console.log('In Postman, set baseUrl to: http://localhost:3000');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('========================================');
  console.log('');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${port} is already in use!`);
    console.error('Please close any other applications using port 3000 and try again.\n');
  } else {
    console.error(`\n❌ Server error: ${error.message}\n`);
  }
  process.exit(1);
});
