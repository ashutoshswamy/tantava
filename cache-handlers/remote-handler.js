const { Redis } = require("@upstash/redis");

// Shared Redis store IS the cross-instance cache, so unlike a local-memory
// handler there's no separate local tag state to sync — refreshTags is a no-op
// and getExpiration reads tag timestamps straight from Redis.
const redis = Redis.fromEnv();

function entryKey(cacheKey) {
  return `nextcache:entry:${cacheKey}`;
}

function tagKey(tag) {
  return `nextcache:tag:${tag}`;
}

async function readStream(stream) {
  const reader = stream.getReader();
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

function toStream(base64) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(Buffer.from(base64, "base64"));
      controller.close();
    },
  });
}

module.exports = {
  async get(cacheKey, softTags) {
    const data = await redis.get(entryKey(cacheKey));
    if (!data) return undefined;

    const allTags = [...(data.tags || []), ...softTags];
    if (allTags.length > 0) {
      const invalidatedAt = await module.exports.getExpiration(allTags);
      if (invalidatedAt > data.timestamp) return undefined;
    }

    return {
      value: toStream(data.value),
      tags: data.tags,
      stale: data.stale,
      timestamp: data.timestamp,
      expire: data.expire,
      revalidate: data.revalidate,
    };
  },

  async set(cacheKey, pendingEntry) {
    const entry = await pendingEntry;
    const value = (await readStream(entry.value)).toString("base64");

    await redis.set(
      entryKey(cacheKey),
      {
        value,
        tags: entry.tags,
        stale: entry.stale,
        timestamp: entry.timestamp,
        expire: entry.expire,
        revalidate: entry.revalidate,
      },
      { ex: entry.expire }
    );
  },

  async refreshTags() {
    // no-op: Redis is the single shared source of truth, nothing local to sync
  },

  async getExpiration(tags) {
    if (tags.length === 0) return 0;
    const timestamps = await redis.mget(...tags.map(tagKey));
    return Math.max(0, ...timestamps.map((t) => Number(t) || 0));
  },

  async updateTags(tags) {
    const now = Date.now();
    const pipeline = redis.pipeline();
    for (const tag of tags) {
      pipeline.set(tagKey(tag), now);
    }
    await pipeline.exec();
  },
};
