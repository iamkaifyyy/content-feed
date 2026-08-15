import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db";
import Content from "./models/Content";

const sampleArticles = [
  {
    title: "Understanding the Node.js Event Loop and libuv Under Load",
    description: "A deep dive into thread pools, microtask queues, and how asynchronous I/O is managed when handling high concurrency in Node.js services.",
    source: "Node.js Core",
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
    daysAgo: 1,
  },
  {
    title: "Zero-Downtime Database Migrations in Distributed Environments",
    description: "Strategies for schema expansion, contract-based column deprecation, and dual-write architectures across high-throughput production databases.",
    source: "Stripe Engineering",
    url: "https://stripe.com/blog/online-migrations",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
    daysAgo: 2,
  },
  {
    title: "Designing Idempotent APIs with Redis and Distributed Locks",
    description: "Preventing double-charges and redundant operations using idempotency keys, state machines, and atomic lock leases with redlock.",
    source: "System Design Digest",
    url: "https://brandur.org/idempotency-keys",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    daysAgo: 3,
  },
  {
    title: "Optimizing MongoDB Indexes for Complex Query Patterns",
    description: "How compound indexes, equality-sort-range rules, and partial filter indexes cut query latency by an order of magnitude.",
    source: "MongoDB Engineering",
    url: "https://www.mongodb.com/docs/manual/core/indexes/",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    daysAgo: 4,
  },
  {
    title: "Architecting Low-Latency Event Streaming with Kafka and Go",
    description: "Lessons learned while scaling real-time message ingestion pipelines past 500,000 events per second with minimal consumer lag.",
    source: "Uber Engineering",
    url: "https://eng.uber.com/reliable-reprocessing/",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    daysAgo: 5,
  },
  {
    title: "Practical Guide to Rate Limiting: Token Bucket vs Leaky Bucket",
    description: "Comparing algorithms for traffic shaping, sliding window counters in Redis, and handling spiky traffic gracefully.",
    source: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/how-we-built-rate-limiting-infrastructure/",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=60",
    daysAgo: 6,
  },
  {
    title: "What's New in TypeScript 5.6: Const Type Parameters and Iterator Helpers",
    description: "An overview of compiler enhancements, improved type inference for tuple literals, and build performance improvements.",
    source: "TypeScript Weekly",
    url: "https://devblogs.microsoft.com/typescript/",
    image: "https://images.unsplash.com/photo-1516116211227-bbc13c72e911?w=800&auto=format&fit=crop&q=60",
    daysAgo: 7,
  },
  {
    title: "Securing Microservices with OAuth 2.0 and JWT Revocation Lists",
    description: "Balancing the stateless benefits of JSON Web Tokens with the practical need for immediate session revocation using Redis blacklists.",
    source: "Auth0 Engineering",
    url: "https://auth0.com/blog/blacklist-json-web-token-api-keys/",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    daysAgo: 8,
  },
  {
    title: "Solving the N+1 Query Problem in GraphQL and REST APIs",
    description: "Implementing DataLoader batching, SQL join optimizations, and query analysis to eliminate cascading database roundtrips.",
    source: "Prisma Blog",
    url: "https://www.prisma.io/blog/graphql-directive-permissions-authorization-789",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    daysAgo: 9,
  },
  {
    title: "Demystifying Server-Sent Events (SSE) vs WebSockets for Live Feeds",
    description: "Why unidirectional HTTP streaming is often simpler, more resilient with HTTP/2, and easier to cache than bi-directional WebSockets.",
    source: "Web Architecture",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    daysAgo: 10,
  },
  {
    title: "Building Resilient Background Workers with BullMQ and Redis",
    description: "Reliable job queues, exponential backoff retries, concurrency controls, and dead-letter queues in production Node.js applications.",
    source: "Engineering Blog",
    url: "https://docs.bullmq.io/",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    daysAgo: 11,
  },
  {
    title: "Database Indexing Under the Hood: B-Trees, LSM Trees, and WAL",
    description: "How storage engines write data to disk, manage write-ahead logs, and traverse tree structures for point and range queries.",
    source: "Database Weekly",
    url: "https://cstack.github.io/db_tutorial/",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
    daysAgo: 12,
  },
  {
    title: "How Discord Scaled Elixir and Rust to 11 Million Concurrent Users",
    description: "Architecting Discord's real-time messaging pipeline, switching from Go to Rust for memory management, and optimizing GenServer pools.",
    source: "Discord Engineering",
    url: "https://discord.com/blog/why-discord-is-switching-from-go-to-rust",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    daysAgo: 13,
  },
  {
    title: "Scaling PostgreSQL Connection Pooling with PgBouncer and Envoy",
    description: "How connection multiplexing, transaction pooling, and DNS failover prevent database connection exhaustion during traffic surges.",
    source: "Netflix TechBlog",
    url: "https://netflixtechblog.com/",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=60",
    daysAgo: 14,
  },
  {
    title: "Writing High-Performance Microservices with gRPC and Protocol Buffers",
    description: "Benchmarking gRPC vs REST with JSON over HTTP/2, covering binary serialization efficiency and streaming semantics in Go.",
    source: "Google Cloud",
    url: "https://grpc.io/docs/what-is-grpc/introduction/",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60",
    daysAgo: 15,
  },
  {
    title: "Distributed Tracing at Scale: OpenTelemetry, Jaeger, and Sampling Strategies",
    description: "Correlating asynchronous requests across microservice boundaries without overwhelming observability backends with excessive trace data.",
    source: "Uber Engineering",
    url: "https://opentelemetry.io/docs/concepts/signals/traces/",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60",
    daysAgo: 16,
  },
  {
    title: "Understanding Consistent Hashing and Virtual Nodes in Distributed Caching",
    description: "How Dynamo-style distributed hash rings minimize re-keying and prevent hot spot nodes when adding or removing cache servers.",
    source: "High Scalability",
    url: "https://www.toptal.com/big-data/consistent-hashing",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    daysAgo: 17,
  },
  {
    title: "Zero-Trust Architecture for Cloud Native Kubernetes Clusters",
    description: "Implementing mTLS with Istio service mesh, SPIFFE identities, and network policy segmentation across production multi-tenant clusters.",
    source: "Cloud Native Foundation",
    url: "https://istio.io/latest/docs/concepts/security/",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    daysAgo: 18,
  },
  {
    title: "How GitHub Handles Millions of Webhook Deliveries per Minute",
    description: "Dissecting Hookshot: an internal high-throughput webhook delivery service built on top of MySQL, Kafka, and Go workers.",
    source: "GitHub Engineering",
    url: "https://github.blog/2021-05-10-how-we-built-github-actions-to-scale/",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=60",
    daysAgo: 19,
  },
  {
    title: "Deep Dive into Linux epoll: Asynchronous Non-Blocking I/O Explained",
    description: "How the Linux kernel notifies event loops of file descriptor readiness, comparing select, poll, epoll, and the modern io_uring interface.",
    source: "Kernel Systems",
    url: "https://man7.org/linux/man-pages/man7/epoll.7.html",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60",
    daysAgo: 20,
  },
  {
    title: "Cache Stampede Prevention: Mutual Exclusion, Probabilistic Early Expiration, and Pre-fetching",
    description: "Protecting origin databases from crashing under high traffic when popular cached keys expire simultaneously.",
    source: "Vercel Engineering",
    url: "https://en.wikipedia.org/wiki/Cache_stampede",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    daysAgo: 21,
  },
  {
    title: "Designing Multi-Region Active-Active Databases with Conflict Resolution",
    description: "Evaluating CRDTs (Conflict-Free Replicated Data Types), Last-Write-Wins timestamps, and multi-leader replication topologies.",
    source: "AWS Architecture",
    url: "https://aws.amazon.com/dynamodb/global-tables/",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    daysAgo: 22,
  },
  {
    title: "How Stripe Prevents Fraud in Real-Time with Machine Learning Radar",
    description: "Evaluating thousands of signals under 100ms latency to detect card testing, identity theft, and fraudulent checkout transactions.",
    source: "Stripe Engineering",
    url: "https://stripe.com/radar",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    daysAgo: 23,
  },
  {
    title: "Building Real-Time Collaborative Canvas Apps with WebSockets & CRDTs",
    description: "Under the hood of collaborative state engines: Yjs, operational transformation, peer-to-peer sync, and conflict resolution in Figma-like apps.",
    source: "Figma Engineering",
    url: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
    daysAgo: 24,
  }
];

const seed = async (): Promise<void> => {
  await connectDB();

  await Content.deleteMany({});
  console.log("Cleared existing articles collection");

  const items = sampleArticles.map((article) => {
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - article.daysAgo);

    return {
      title: article.title,
      description: article.description,
      source: article.source,
      url: article.url,
      image: article.image,
      publishedAt,
    };
  });

  const created = await Content.insertMany(items);
  console.log(`Successfully seeded ${created.length} articles`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err: Error) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
