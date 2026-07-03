"use client";
// CommunityView — trusted customers page with photo gallery, testimonials,
// and a blog/journal section. Uses real customer lifestyle photos fetched
// via web image search.
import { useStore } from "@/lib/store";
import { COMMUNITY_IMAGES } from "@/lib/community-images";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Stars } from "@/components/site/Stars";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    location: "Mumbai, MH",
    product: "OneShot ProBeat Buds",
    rating: 5,
    text: "The ANC is genuinely impressive for the price. I use them on my daily commute and the noise cancellation blocks out the train completely. Sound is rich and bass is deep without being muddy.",
    initial: "A",
  },
  {
    name: "Sneha Reddy",
    location: "Bengaluru, KA",
    product: "OneShot EchoBuds",
    rating: 5,
    text: "I take meetings all day and these are the clearest calling earbuds I've used. My colleagues say they can hear me perfectly even in a noisy cafe. Battery lasts the whole workday.",
    initial: "S",
  },
  {
    name: "Vikram Patel",
    location: "Ahmedabad, GJ",
    product: "OneShot PulsePods",
    rating: 4,
    text: "Perfect for my morning runs. They stay locked in no matter how fast I go, and the sweat resistance has held up through monsoon. Connection never drops when my phone is in my arm band.",
    initial: "V",
  },
  {
    name: "Priya Nair",
    location: "Kochi, KL",
    product: "OneShot BoomBox S2",
    rating: 5,
    text: "Bought this for my terrace gatherings and it fills the whole space. Bass is punchy, volume is loud for the size, and it pairs instantly. The LED indicator is a nice touch.",
    initial: "P",
  },
  {
    name: "Rohan Mehta",
    location: "Pune, MH",
    product: "OneShot MaxWave H5",
    rating: 5,
    text: "These headphones are a steal at this price. The low-latency mode is perfect for movies and gaming. Memory foam earcups are comfortable for hours. Matte finish feels premium.",
    initial: "R",
  },
  {
    name: "Ananya Das",
    location: "Kolkata, WB",
    product: "OneShot ZenBuds",
    rating: 5,
    text: "I bought these for study sessions and they're perfect. The passive isolation is great and the sound is soft and balanced — not fatiguing after hours of listening. Very comfortable.",
    initial: "A",
  },
];

const BLOG_POSTS = [
  {
    title: "How to Choose the Right Earbuds for Your Routine",
    excerpt:
      "Music, calls, sport, or focus — the right earbuds depend on how you'll use them. This guide breaks down what matters for each scenario.",
    category: "Buying Guide",
    date: "May 15, 2025",
    readTime: "5 min read",
    image: COMMUNITY_IMAGES.blog[0],
  },
  {
    title: "Understanding Bluetooth 5.3: What Actually Changed",
    excerpt:
      "Bluetooth 5.3 isn't just a version number. We explain the real-world benefits — lower latency, better battery, and more stable connections.",
    category: "Sound Science",
    date: "May 8, 2025",
    readTime: "4 min read",
    image: COMMUNITY_IMAGES.blog[1],
  },
  {
    title: "Earbuds Care 101: Make Your Pair Last Longer",
    excerpt:
      "Simple habits that extend the life of your earbuds — cleaning, storage, charging, and what to avoid. A 2-minute routine that saves money.",
    category: "Care Guide",
    date: "May 1, 2025",
    readTime: "3 min read",
    image: COMMUNITY_IMAGES.blog[2],
  },
];

const GALLERY_CAPTIONS = [
  "Aarav · ProBeat Buds",
  "Sneha · NeoSound H4",
  "Vikram · PulsePods",
  "Priya · BoomBox S2",
  "Ananya · ZenBuds",
  "Rohan · MaxWave H5",
  "Karan · GameX Pro G2",
  "Meera & Raj · AirBuds",
];

export function CommunityView() {
  const navigate = useStore((s) => s.navigate);

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Our Community"
        title={
          <>
            Trusted by
            <br />
            real listeners.
          </>
        }
        intro="Over 1 lakh customers across India use OneShot every day — on commutes, in meetings, at the gym, and in quiet moments. Here are some of their stories."
      />

      {/* Stats */}
      <section className="border-b border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-16">
          <Reveal className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: "1L+", label: "Happy listeners" },
              { value: "4.5★", label: "Average rating" },
              { value: "31", label: "Products shipped" },
              { value: "500+", label: "Pincodes served" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-[var(--font-display)] text-[32px] font-medium leading-none text-primary sm:text-[44px]">
                  {s.value}
                </div>
                <div className="mt-2 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Customer Gallery */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
        <Reveal className="mb-10">
          <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
            Real moments
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
            OneShot in the wild.
          </h2>
          <p className="mt-3 max-w-xl font-[var(--font-body)] text-[16px] text-secondary">
            Photos from customers who tagged us. Tag{" "}
            <span className="font-semibold text-primary">@oneshot.in</span> on
            social to be featured.
          </p>
        </Reveal>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {COMMUNITY_IMAGES.gallery.map((src, i) => (
            <Reveal
              key={i}
              delay={Math.min(i, 6) * 60}
              className={cn(
                "group relative overflow-hidden border border-brushed-silver bg-surface-container-low",
                // Make some tiles taller for a masonry feel
                i === 0 || i === 5 ? "row-span-2 aspect-[3/4]" : "aspect-square",
              )}
            >
              <img
                src={src}
                alt={`Customer photo: ${GALLERY_CAPTIONS[i]}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-on-dark">
                  {GALLERY_CAPTIONS[i]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
          <Reveal className="mb-12">
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
              What they say
            </span>
            <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
              Customer stories.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal
                key={t.name}
                delay={Math.min(i, 5) * 70}
                className="flex flex-col border border-brushed-silver bg-canvas-white p-6"
              >
                <div className="flex items-center justify-between">
                  <Stars rating={t.rating} size={16} />
                  <span className="material-symbols-outlined text-[20px] text-leather-tan">
                    format_quote
                  </span>
                </div>
                <p className="mt-4 flex-1 font-[var(--font-body)] text-[15px] leading-relaxed text-on-surface-variant">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-brushed-silver pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-[var(--font-display)] text-[14px] font-semibold text-on-primary">
                    {t.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary">
                      {t.name}
                    </p>
                    <p className="font-[var(--font-body)] text-[12px] text-secondary">
                      {t.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate({ view: "collection" })}
                  className="mt-3 text-left font-[var(--font-body)] text-[12px] text-leather-tan hover:underline"
                >
                  Bought: {t.product} →
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Journal */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
        <Reveal className="mb-12 flex items-end justify-between gap-4">
          <div>
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
              The Journal
            </span>
            <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
              Guides & stories.
            </h2>
          </div>
          <button
            onClick={() => navigate({ view: "faq" })}
            className="hidden shrink-0 border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary hover:text-leather-tan sm:block"
          >
            View all articles →
          </button>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <Reveal
              key={post.title}
              delay={i * 80}
              className="group cursor-pointer"
            >
              <article>
                <div className="relative aspect-[16/10] overflow-hidden border border-brushed-silver bg-surface-container-low">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-0 top-0 bg-primary px-3 py-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-on-dark">
                    {post.category}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-3 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-brushed-silver" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-[var(--font-display)] text-[20px] font-medium leading-tight tracking-tight text-primary transition-colors group-hover:text-leather-tan">
                    {post.title}
                  </h3>
                  <p className="mt-2 font-[var(--font-body)] text-[14px] leading-relaxed text-secondary">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 flex items-center gap-1 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary">
                    Read more
                    <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep-charcoal py-16 text-on-dark lg:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-5 text-center lg:px-16">
          <Reveal className="mx-auto max-w-xl">
            <h2 className="font-[var(--font-display)] text-[28px] font-medium tracking-tight text-on-dark sm:text-[36px]">
              Join the community.
            </h2>
            <p className="mt-3 font-[var(--font-body)] text-[16px] text-on-dark/70">
              Get early access to drops, sound tips, and customer-only deals.
            </p>
            <div className="mt-8 flex justify-center">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
