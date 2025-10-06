// Netlify Function: saveSpin
// This function handles saving Chaos Wheel spin results
// Stores results in a simple JSON structure for demonstration

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { result, timestamp, roarPoints } = body;

    // Validate input
    if (!result || !timestamp) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields: result, timestamp' })
      };
    }

    // Create spin record
    const spinRecord = {
      id: Date.now().toString(),
      result,
      timestamp,
      roarPoints: roarPoints || 100,
      userAgent: event.headers['user-agent'],
      ip: event.headers['client-ip'] || 'unknown'
    };

    // In a real implementation, you would save this to a database
    // For now, we'll just log it and return success
    console.log('Spin recorded:', spinRecord);

    // Example response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Spin result saved successfully',
        data: {
          id: spinRecord.id,
          result: spinRecord.result,
          timestamp: spinRecord.timestamp
        }
      })
    };

  } catch (error) {
    console.error('Error saving spin:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

// Example usage:
// POST /.netlify/functions/saveSpin
// Body: {
//   "result": "🎁 Airdrop",
//   "timestamp": "2024-01-01T00:00:00.000Z",
//   "roarPoints": 100
// }

// Future enhancements could include:
// - Database integration (PostgreSQL, MongoDB, etc.)
// - User authentication and session management
// - Rate limiting and spam protection
// - Detailed analytics and reporting
// - Integration with blockchain for transparent recording