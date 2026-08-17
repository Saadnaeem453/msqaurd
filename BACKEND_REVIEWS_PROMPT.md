# Reviews System — Backend Implementation Guide

## Overview
Build a complete, production-grade reviews system for the MSQUARED event platform. Reviews are tied to events and can only be submitted by attendees who have booked a ticket for that event. Each attendee can submit only ONE review per event. Reviews support helpful voting, replies (threaded), and tagging.

---

## 1. Database Models

### `reviews` table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `event_id` | UUID | NOT NULL, FOREIGN KEY → events(id) ON DELETE CASCADE |
| `user_id` | UUID | NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE |
| `rating` | INTEGER | NOT NULL, CHECK (rating BETWEEN 1 AND 5) |
| `comment` | TEXT | NOT NULL, CHECK (length(comment) >= 10 AND length(comment) <= 2000) |
| `is_verified` | BOOLEAN | DEFAULT true (auto-set when booking is confirmed) |
| `helpful_count` | INTEGER | DEFAULT 0 |
| `tags` | TEXT[] | DEFAULT '{}' — user-selected tags like 'Enlightening', 'Well-Organized' |
| `parent_id` | UUID | NULLABLE, FOREIGN KEY → reviews(id) ON DELETE CASCADE — for replies (self-referential) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW(), auto-updated on change |

**Unique constraint:** `UNIQUE(event_id, user_id)` — one review per user per event (only applies to top-level reviews where parent_id IS NULL).

**Indexes:**
- `idx_reviews_event_id` on `event_id`
- `idx_reviews_user_id` on `user_id`
- `idx_reviews_parent_id` on `parent_id`
- `idx_reviews_rating` on `rating`
- `idx_reviews_created_at` on `created_at DESC`

### `review_helpful` table (tracks who marked a review helpful)
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `review_id` | UUID | NOT NULL, FOREIGN KEY → reviews(id) ON DELETE CASCADE |
| `user_id` | UUID | NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

**Unique constraint:** `UNIQUE(review_id, user_id)` — one helpful vote per user per review.

**Indexes:**
- `idx_review_helpful_review_id` on `review_id`

---

## 2. API Endpoints

All endpoints are under `/api`. Authenticated endpoints require a valid JWT Bearer token in the `Authorization` header.

### 2.1 GET `/events/public/:eventId/reviews`
**Auth:** None (public)
**Purpose:** Get all reviews for an event with aggregated stats.

**Query params:**
- `page` (number, default 1)
- `limit` (number, default 10, max 50)
- `sort` (string: "top_rated" | "most_recent" | "most_helpful", default "top_rated")

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "event_id": "uuid",
        "user_id": "uuid",
        "user_name": "John Doe",
        "user_avatar": "https://...",
        "rating": 5,
        "comment": "Great event...",
        "is_verified": true,
        "helpful_count": 42,
        "tags": ["Enlightening", "Well-Organized"],
        "parent_id": null,
        "created_at": "2025-01-15T10:00:00Z",
        "replies": [
          {
            "id": "uuid",
            "user_name": "Organizer",
            "user_avatar": "https://...",
            "comment": "Thank you for the kind words!",
            "created_at": "2025-01-16T10:00:00Z"
          }
        ]
      }
    ],
    "average_rating": 4.9,
    "total_reviews": 128,
    "rating_breakdown": [
      { "stars": 5, "count": 118, "percent": 92 },
      { "stars": 4, "count": 8, "percent": 6 },
      { "stars": 3, "count": 2, "percent": 2 },
      { "stars": 2, "count": 0, "percent": 0 },
      { "stars": 1, "count": 0, "percent": 0 }
    ],
    "trending_tags": ["Enlightening", "Well-Organized", "Great Atmosphere", "Networking"],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 128,
      "total_pages": 13
    }
  },
  "detail": "Reviews fetched successfully"
}
```

**Logic:**
- Return all top-level reviews (where `parent_id IS NULL`)
- Each review includes its direct replies (one level deep, `parent_id = review.id`)
- Sort by `rating DESC, helpful_count DESC, created_at DESC` for "top_rated"
- Sort by `created_at DESC` for "most_recent"
- Sort by `helpful_count DESC, created_at DESC` for "most_helpful"
- `average_rating`: AVG(rating) rounded to 1 decimal
- `rating_breakdown`: COUNT per rating 1–5 with percentages
- `trending_tags`: top 5 most frequent tags across all reviews for this event
- `user_name`: from users table (full_name)
- `user_avatar`: from users table (avatar_url)

---

### 2.2 POST `/events/:eventId/reviews`
**Auth:** Required (JWT)
**Purpose:** Submit a new review. Only attendees who have booked a ticket for this event can review. One review per attendee per event.

**Request body:**
```json
{
  "rating": 5,
  "comment": "This event was amazing. The speakers were world-class and the venue was perfect.",
  "tags": ["Enlightening", "Well-Organized"]
}
```

**Validation:**
1. User must be authenticated (valid JWT)
2. `rating` must be 1–5
3. `comment` must be 10–2000 characters
4. `tags` must be an array of strings, max 5 tags, each max 30 chars
5. **User must have a confirmed booking for this event** — check bookings table for a record with `user_id = current_user.id` AND `event_id = :eventId` AND `status = 'confirmed'`
6. **User must not already have a top-level review for this event** — check reviews table for `user_id = current_user.id` AND `event_id = :eventId` AND `parent_id IS NULL`

**Errors:**
- `401` — Not authenticated
- `400` — Validation error (invalid rating, comment too short/long, too many tags)
- `403` — "You must book this event before leaving a review" (no confirmed booking)
- `409` — "You have already reviewed this event" (duplicate review)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "user_id": "uuid",
    "rating": 5,
    "comment": "...",
    "tags": ["Enlightening", "Well-Organized"],
    "helpful_count": 0,
    "is_verified": true,
    "created_at": "2025-01-15T10:00:00Z"
  },
  "detail": "Review submitted successfully"
}
```

---

### 2.3 PUT `/reviews/:reviewId`
**Auth:** Required
**Purpose:** Edit own review. Only the review author can edit.

**Request body:**
```json
{
  "rating": 4,
  "comment": "Updated comment...",
  "tags": ["Well-Organized"]
}
```

**Validation:**
1. User must be authenticated
2. Review must belong to the current user (`user_id = current_user.id`)
3. Same field validation as POST

**Errors:**
- `401` — Not authenticated
- `403` — "You can only edit your own review"
- `404` — Review not found
- `400` — Validation error

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated review object */ },
  "detail": "Review updated successfully"
}
```

---

### 2.4 DELETE `/reviews/:reviewId`
**Auth:** Required
**Purpose:** Delete own review. Only the review author can delete. Cascades replies.

**Validation:**
1. User must be authenticated
2. Review must belong to the current user

**Errors:**
- `401` — Not authenticated
- `403` — "You can only delete your own review"
- `404` — Review not found

**Response (200):**
```json
{
  "success": true,
  "detail": "Review deleted successfully"
}
```

---

### 2.5 POST `/reviews/:reviewId/helpful`
**Auth:** Required
**Purpose:** Toggle helpful vote on a review. One vote per user per review.

**Logic:**
- If user has already voted helpful → remove vote, decrement `helpful_count`
- If user has not voted → add vote, increment `helpful_count`
- Return current state (whether user has voted, current count)

**Errors:**
- `401` — Not authenticated
- `404` — Review not found

**Response (200):**
```json
{
  "success": true,
  "data": {
    "review_id": "uuid",
    "helpful_count": 43,
    "user_has_voted": true
  },
  "detail": "Helpful vote toggled"
}
```

---

### 2.6 POST `/reviews/:reviewId/reply`
**Auth:** Required
**Purpose:** Reply to a review. Any authenticated user can reply (organizer or attendee). Replies are limited to ONE level (no nested replies to replies).

**Request body:**
```json
{
  "comment": "Thank you for your feedback! We're glad you enjoyed the event."
}
```

**Validation:**
1. User must be authenticated
2. `comment` must be 5–1000 characters
3. The target review must be a top-level review (`parent_id IS NULL`) — replies cannot be nested
4. User must not have already replied to this review (check: no existing review with `parent_id = :reviewId` AND `user_id = current_user.id`)

**Errors:**
- `401` — Not authenticated
- `400` — Validation error (comment too short/long)
- `403` — "You cannot reply to a reply" (target is already a reply)
- `409` — "You have already replied to this review"
- `404` — Review not found

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "parent_id": "uuid",
    "user_id": "uuid",
    "user_name": "Organizer Name",
    "user_avatar": "https://...",
    "comment": "Thank you for your feedback!",
    "created_at": "2025-01-16T10:00:00Z"
  },
  "detail": "Reply posted successfully"
}
```

---

### 2.7 GET `/reviews/:reviewId/replies`
**Auth:** None (public)
**Purpose:** Get all replies for a review.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_name": "Organizer Name",
      "user_avatar": "https://...",
      "comment": "Thank you!",
      "created_at": "2025-01-16T10:00:00Z"
    }
  ],
  "detail": "Replies fetched"
}
```

---

### 2.8 GET `/events/:eventId/reviews/my-review`
**Auth:** Required
**Purpose:** Check if the current user has already reviewed this event. Used by frontend to show/hide the "Write a Review" button.

**Response (200) — has review:**
```json
{
  "success": true,
  "data": {
    "has_reviewed": true,
    "review": {
      "id": "uuid",
      "rating": 5,
      "comment": "...",
      "tags": ["..."],
      "created_at": "..."
    }
  }
}
```

**Response (200) — no review:**
```json
{
  "success": true,
  "data": {
    "has_reviewed": false,
    "can_review": true
  }
}
```

**Response (200) — cannot review (no booking):**
```json
{
  "success": true,
  "data": {
    "has_reviewed": false,
    "can_review": false,
    "reason": "You must book this event to leave a review"
  }
}
```

**Logic:**
1. Check reviews table for `user_id = current_user.id` AND `event_id = :eventId` AND `parent_id IS NULL`
2. If no review found, check bookings table for confirmed booking
3. Return appropriate response

---

## 3. Business Rules Summary

1. **One review per attendee per event** — enforced by UNIQUE constraint + API check
2. **Only booked attendees can review** — must have `status = 'confirmed'` booking
3. **Replies are one level deep** — `parent_id` can only point to top-level reviews
4. **One helpful vote per user per review** — enforced by UNIQUE constraint
5. **One reply per user per review** — user cannot reply twice to the same review
6. **Rating is immutable after submission** — can only be changed via PUT (edit own review)
7. **Verified badge** — `is_verified` is set to `true` automatically when booking is confirmed
8. **Tags** — max 5 per review, predefined list: "Enlightening", "Well-Organized", "Great Atmosphere", "Networking", "Informative", "Inspiring", "Well-Structured", "Engaging"

---

## 4. Available Tags (seed data)

```
Enlightening
Well-Organized
Great Atmosphere
Networking
Informative
Inspiring
Well-Structured
Engaging
```

---

## 5. SQL Migration

```sql
-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL CHECK (length(comment) >= 10 AND length(comment) <= 2000),
  is_verified BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  parent_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per user per event (top-level only)
  CONSTRAINT unique_event_user_review UNIQUE (event_id, user_id),

  -- Replies can only point to top-level reviews
  CONSTRAINT check_parent_is_top_level CHECK (
    parent_id IS NULL OR
    (SELECT parent_id FROM reviews WHERE id = parent_id) IS NULL
  )
);

-- Helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_helpful_vote UNIQUE (review_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_event_id ON reviews(event_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_parent_id ON reviews(parent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON review_helpful(review_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_updated_at_trigger
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_updated_at();
```

---

## 6. Route Registration

Register these routes in your Express/Fastify router:

```
GET    /api/events/public/:eventId/reviews      → reviewsController.getEventReviews
POST   /api/events/:eventId/reviews             → reviewsController.createReview        [auth]
GET    /api/events/:eventId/reviews/my-review   → reviewsController.getMyReview          [auth]
PUT    /api/reviews/:reviewId                   → reviewsController.updateReview         [auth]
DELETE /api/reviews/:reviewId                   → reviewsController.deleteReview         [auth]
POST   /api/reviews/:reviewId/helpful           → reviewsController.toggleHelpful        [auth]
POST   /api/reviews/:reviewId/reply             → reviewsController.createReply          [auth]
GET    /api/reviews/:reviewId/replies           → reviewsController.getReplies
```

---

## 7. Frontend Integration Endpoints

These are the exact endpoints the frontend will call:

| Frontend Action | Method | Endpoint | Auth |
|----------------|--------|----------|------|
| Load event reviews | GET | `/api/events/public/:eventId/reviews` | No |
| Check if user reviewed | GET | `/api/events/:eventId/reviews/my-review` | Yes |
| Submit review | POST | `/api/events/:eventId/reviews` | Yes |
| Edit review | PUT | `/api/reviews/:reviewId` | Yes |
| Delete review | DELETE | `/api/reviews/:reviewId` | Yes |
| Toggle helpful | POST | `/api/reviews/:reviewId/helpful` | Yes |
| Post reply | POST | `/api/reviews/:reviewId/reply` | Yes |
| Load replies | GET | `/api/reviews/:reviewId/replies` | No |
