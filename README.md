
### Create a QR Code

**Endpoint:** `/qr`
**Method:** `POST`

**Request:**

To create a QR code, send a POST request with the type of QR code and the content to be encoded.

**API Call Example:**

```http
POST /qr
Content-Type: application/json

{
  "type": "Text",
  "content": "Hello, World!"
}
```

- `type` (string): The type of QR code, which can be "Text," "SMS," "Email," "Url," or "Wifi."
- `content` (string or object): The content to be encoded into the QR code, depending on the type.

**Response:**

The API will respond with an SVG representation of the generated QR code.

**Response Example:**

```xml
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="200" height="200" ...>
  <!-- SVG content representing the QR code -->
</svg>
```

### Generate a New Short URL

**Endpoint:** `/url`
**Method:** `POST`

**Request:**

To generate a new short URL, send a POST request with the original URL you want to shorten.

**API Call Example:**

```http
POST /url
Content-Type: application/json

{
  "url": "https://example.com/long-url"
}
```

- `url` (string): The original URL you want to shorten.

**Response:**

The API will respond with the unique short ID associated with the shortened URL.

**Response Example:**

```json
{
  "id": "AbCdEfGh"
}
```

### Get Analytics for a Short URL

**Endpoint:** `/url/analytics/:shortId`
**Method:** `GET`

**Request:**

To get analytics for a specific short URL, send a GET request to `/url/analytics/:shortId`, where `:shortId` is the short ID associated with the URL.

**API Call Example:**

```http
GET /url/analytics/AbCdEfGh
```

**Response:**

The API will respond with analytics data for the specified short URL, including the total number of clicks and a history of visits.

**Response Example:**

```json
{
  "totalClicks": 42,
  "analytics": [
    {
      "timestamp": "2023-09-01T12:00:00Z",
      "referrer": "https://referrer.com/",
      "userAgent": "Mozilla/5.0 ..."
    },
    {
      "timestamp": "2023-09-02T10:30:00Z",
      "referrer": "https://referrer2.com/",
      "userAgent": "Mozilla/5.0 ..."
    },
    // More visit records...
  ]
}
```

These examples provide a simplified overview of how to use each API endpoint, what data to include in the requests, and what to expect in the responses. Be sure to replace the placeholders with your actual API URLs and IDs.
