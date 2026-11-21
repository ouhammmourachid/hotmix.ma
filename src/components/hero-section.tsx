import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import styles from '@/styles/main.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';
import { useApiService } from '@/services/api.service';
import Product from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';

const MAX_PICKS = 8;
// How long each slide is on screen before the next crossfade starts
const INTERVAL_MS = 5500;
// Crossfade: long and symmetric (ease-in-out) so neither end of the fade snaps
const FADE = { duration: 1.6, ease: [0.45, 0, 0.55, 1] as const };
// Slow push-in on the visible photo (1.06x -> 1x) across its whole time on screen
const PUSH_IN_MS = INTERVAL_MS + 1600;
// Don't wait forever for a slow image: advance anyway after this long
const MAX_WAIT_MS = 6000;

type Pick = { productId: string; name: string; src: string };
type Role = 'current' | 'previous' | 'next';

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Random products, each with one random image of theirs */
function pickRandom(products: Product[]): Pick[] {
  return shuffle(products.filter((p) => p.images && p.images.length > 0))
    .slice(0, MAX_PICKS)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      src: p.images[Math.floor(Math.random() * p.images.length)].path,
    }));
}

function Slide({ pick, sizes, priority, settled, onReady }: {
  pick: Pick;
  sizes: string;
  priority?: boolean;
  // true while this photo is (or was last) the one on screen: it eases to its resting scale
  settled: boolean;
  onReady: (src: string) => void;
}) {
  return (
    <Link
      href={`/products/${pick.productId}`}
      aria-label={pick.name}
      className="relative block w-full h-full bg-surface overflow-hidden"
    >
      <div
        className="absolute inset-0 will-change-transform motion-reduce:!transform-none motion-reduce:!transition-none"
        style={{
          transform: settled ? 'scale(1)' : 'scale(1.06)',
          transformOrigin: '50% 30%',
          transition: settled ? `transform ${PUSH_IN_MS}ms linear` : 'none',
        }}
      >
        <Image
          src={pick.src}
          alt={pick.name}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'eager'}
          // Fade only once the pixels are decoded, so nothing pops in mid-crossfade
          onLoad={(e) => {
            const img = e.currentTarget;
            (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).finally(() => onReady(pick.src));
          }}
          onError={() => onReady(pick.src)}
          className="object-cover object-top"
        />
      </div>
    </Link>
  );
}

function Dots({ count, active, onSelect, className }: { count: number; active: number; onSelect: (i: number) => void; className: string }) {
  if (count < 2) return null;
  return (
    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-10 items-center gap-1.5 px-2.5 py-2 rounded-full material-thin ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => { if (index !== active) onSelect(index); }}
          className={`h-1.5 rounded-full transition-[width,background-color] duration-700 ease-in-out ${
            index === active ? 'w-5 bg-label' : 'w-1.5 bg-label/45 hover:bg-label/70'
          }`}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === active}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const api = useApiService();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [step, setStep] = useState(0);
  // The slide we came from (stays underneath during the crossfade, whatever the jump)
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [ready, setReady] = useState<Set<string>>(() => new Set());
  const readyRef = useRef(ready);
  readyRef.current = ready;

  const markReady = useCallback((src: string) => {
    setReady((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.product.getAll('page=1&perPage=100');
        setPicks(pickRandom(response.data?.results || []));
      } catch (error) {
        console.error('Hero: failed to load products', error);
      }
    };
    load();
  }, []);

  // Which layout is showing, so we only wait on images the visitor can actually see
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Desktop shows two different products side by side
  const pairs = useMemo(() => {
    const out: [Pick, Pick | null][] = [];
    for (let i = 0; i < picks.length; i += 2) {
      const second = picks[i + 1] ?? (picks.length > 2 ? picks[0] : null);
      out.push([picks[i], second]);
    }
    return out;
  }, [picks]);

  const goTo = useCallback((target: number) => {
    if (target === step) return;
    setPrevStep(step);
    setStep(target);
  }, [step]);

  const mobileIndex = picks.length ? step % picks.length : 0;
  const pairIndex = pairs.length ? step % pairs.length : 0;

  const srcsAt = useCallback((i: number): string[] => {
    if (isDesktop) {
      const pair = pairs[i % pairs.length];
      return pair ? [pair[0].src, ...(pair[1] ? [pair[1].src] : [])] : [];
    }
    const pick = picks[i % picks.length];
    return pick ? [pick.src] : [];
  }, [isDesktop, pairs, picks]);

  const slideCount = isDesktop ? pairs.length : picks.length;

  // Advance only when the next slide's photos are decoded; pause while the tab is hidden
  useEffect(() => {
    if (slideCount < 2) return;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();
    const attempt = () => {
      const nextSrcs = srcsAt(step + 1);
      const nextReady = nextSrcs.every((s) => readyRef.current.has(s));
      const waitedTooLong = Date.now() - startedAt > INTERVAL_MS + MAX_WAIT_MS;
      if (!document.hidden && (nextReady || waitedTooLong)) {
        goTo(step + 1);
      } else {
        timer = setTimeout(attempt, 250);
      }
    };
    timer = setTimeout(attempt, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [step, slideCount, srcsAt, goTo]);

  // Three slides mounted: previous stays underneath while current fades in over it,
  // next preloads invisibly. On the very first slide there is no previous yet.
  const roleOf = (i: number, cur: number, len: number): Role | null => {
    if (i === cur) return 'current';
    if (prevStep !== null && i === prevStep % len) return 'previous';
    if (i === (cur + 1) % len) return 'next';
    return null;
  };
  const opacityFor = (role: Role, isReady: boolean) =>
    role === 'next' ? 0 : role === 'current' ? (isReady ? 1 : 0) : 1;
  const zFor: Record<Role, number> = { current: 3, previous: 2, next: 1 };

  const showSkeleton = picks.length === 0 || !srcsAt(step).every((s) => ready.has(s));

  return (
    <div className="relative w-full overflow-hidden bg-surface aspect-[9/16] md:aspect-auto md:h-[min(82svh,850px)]">
      {/* Loading: a quiet surface until the first photos are decoded */}
      <div
        className={`absolute inset-0 grid md:grid-cols-2 gap-1 bg-primary transition-opacity duration-700 ${showSkeleton && prevStep === null ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        <div className="bg-surface animate-pulse" />
        <div className="hidden md:block bg-surface animate-pulse" />
      </div>

      {/* Phones: one random product photo at a time (only the visible layout is rendered, so only its photos download) */}
      {!isDesktop && (
      <div className="absolute inset-0 md:hidden">
        {picks.map((pick, i) => {
          const role = roleOf(i, mobileIndex, picks.length);
          if (!role) return null;
          const isReady = ready.has(pick.src);
          return (
            <motion.div
              key={pick.productId}
              className="absolute inset-0 will-change-[opacity]"
              style={{ zIndex: zFor[role] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: opacityFor(role, isReady) }}
              transition={FADE}
            >
              <Slide
                pick={pick}
                sizes="100vw"
                priority={i === 0}
                settled={role !== 'next' && isReady}
                onReady={markReady}
              />
            </motion.div>
          );
        })}
      </div>
      )}

      {/* Desktop: two products side by side */}
      {isDesktop && (
      <div className="absolute inset-0 hidden md:block">
        {pairs.map(([left, right], i) => {
          const role = roleOf(i, pairIndex, pairs.length);
          if (!role) return null;
          const isReady = ready.has(left.src) && (!right || ready.has(right.src));
          const settled = role !== 'next' && isReady;
          return (
            <motion.div
              key={left.productId + (right?.productId ?? '')}
              className={`absolute inset-0 grid gap-1 bg-primary will-change-[opacity] ${right ? 'grid-cols-2' : 'grid-cols-1'}`}
              style={{ zIndex: zFor[role] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: opacityFor(role, isReady) }}
              transition={FADE}
            >
              <Slide pick={left} sizes="50vw" priority={i === 0} settled={settled} onReady={markReady} />
              {right && <Slide pick={right} sizes="50vw" priority={i === 0} settled={settled} onReady={markReady} />}
            </motion.div>
          );
        })}
      </div>
      )}

      {/* Content */}
      <div className={`${styles.hero_section_content} pointer-events-none z-10`}>
        <div className="text-center space-y-8 pointer-events-auto">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
            {/* asChild: one interactive element (a link styled as a button), not a button inside a link */}
            <Button asChild className={styles.hero_section_button}>
              <Link href="/products">
                {t('hero_shop_now')} <ChevronRight className="!w-5 !h-5 -me-1 rtl:rotate-180" strokeWidth={2.25} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Page indicators: one per photo on phones, one per pair on desktop */}
      <Dots count={picks.length} active={mobileIndex} onSelect={goTo} className="flex md:hidden" />
      <Dots count={pairs.length} active={pairIndex} onSelect={goTo} className="hidden md:flex" />
    </div>
  );
}
