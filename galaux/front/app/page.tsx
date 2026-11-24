import Link from 'next/link';
import Reveal from './_components/Reveal';
import {
  ArrowRight,
  Blocks,
  Download,
  Gamepad2,
  Layers,
  MessageSquare,
  MousePointerClick,
  PenLine,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';


const SOCIAL = [
  {
    icon: Users,
    title: 'Друзья и ленты',
    text: 'Следите за проектами и новостями серверов прямо в лаунчере.',
  },
  {
    icon: MessageSquare,
    title: 'Личные чаты',
    text: 'Общайтесь с игроками и админами без Discord-переключений.',
  },
  {
    icon: Sparkles,
    title: 'Профиль игрока',
    text: 'Ник, аватар, история сборок и достижения — в одном аккаунте.',
  },
  {
    icon: Gamepad2,
    title: 'Совместный запуск',
    text: 'Заходите на сервер к друзьям в один клик из лаунчера.',
  },
];

const PROMO = [
  {
    icon: Rocket,
    title: 'Продвигайте свой проект',
    text: 'Рекламные блоки на сайте и в лаунчере — вас увидят до выбора сервера.',
  },
  {
    icon: Store,
    title: 'Магазин для игроков',
    text: 'Витрина внутриигровых товаров: кейсы, привилегии, валюта — покупка в пару кликов.',
  },
  {
    icon: PenLine,
    title: 'Расскажите о проекте',
    text: 'Баннеры, описание, скриншоты и новости — оформите сервер в своём стиле.',
  },
];

const STEPS = [
  {
    n: '01',
    icon: MousePointerClick,
    title: 'Запустите лаунчер',
    text: 'Авторизация связывается с аккаунтом Galaux на сайте.',
  },
  {
    n: '02',
    icon: Layers,
    title: 'Выберите проект',
    text: 'Лаунчер покажет только сборки, к которым у вас есть доступ.',
  },
  {
    n: '03',
    icon: Play,
    title: 'Играйте',
    text: 'Нужная версия, моды и конфиги скачаются автоматически.',
  },
];

export default function Home() {
  return (
    <div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid" />

      {/* ===== Hero ===== */}
      <section
        id="launcher"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-24 lg:grid-cols-2"
      >
        <div>
          <span className="chip">Галактика серверов — один лаунчер</span>
          <h1 className="font-display mt-6 text-6xl leading-none tracking-wide text-white md:text-7xl">
            GALAUX
          </h1>
          <p className="mt-4 bg-gradient-to-r from-ice via-neon to-grape bg-clip-text text-xl font-semibold text-transparent">
            Запусти. Играй. Создавай.
          </p>
          <p className="mt-4 max-w-md text-slate-400">
            Скачивай сборки, подключайся к проектам и управляй своим сервером —
            без лишних кликов и сторонних лаунчеров.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/download" className="btn-neon">
              <Download size={18} /> Скачать лаунчер
            </a>
            <Link href="/auth/register" className="btn-ghost">
              Создать проект <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm text-slate-500">
            <div>
              <div className="font-display text-xl text-ice">120+</div> сборок
            </div>
            <div>
              <div className="font-display text-xl text-ice">40K</div> игроков
            </div>
            <div>
              <div className="font-display text-xl text-ice">99.9%</div> аптайм
            </div>
          </div>
        </div>

        {/* Мокап окна лаунчера вместо жёлтых карточек */}
        <Reveal>
          <div className="glass relative rounded-2xl p-5">
            <div className="absolute -inset-8 -z-10 animate-pulse-glow rounded-3xl bg-gradient-to-br from-grape/30 via-neon/20 to-deep/40 blur-2xl" />
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 rounded-full bg-coral/70" />
              <span className="h-3 w-3 rounded-full bg-ice/70" />
              <span className="h-3 w-3 rounded-full bg-neon/70" />
              <span className="ml-2 font-display tracking-wider text-ice">
                GALAUX — LAUNCHER
              </span>
            </div>
            {[
              { name: 'SkyFactory 4', status: 'онлайн', players: '1 204' },
              { name: 'RLCraft Reborn', status: 'онлайн', players: '862' },
              {
                name: 'Create: Новой эры',
                status: 'обновление',
                players: '317',
              },
            ].map((p) => (
              <div
                key={p.name}
                className="glass card-hover mb-3 flex items-center justify-between rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <Blocks className="text-neon" size={20} />
                  <div>
                    <div className="font-semibold text-slate-100">{p.name}</div>
                    <div className="text-xs text-slate-500">
                      {p.players} игроков
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs ${p.status === 'онлайн' ? 'text-emerald-400' : 'text-coral'}`}
                >
                  ● {p.status}
                </span>
              </div>
            ))}
            <button className="btn-neon w-full">
              Запустить сборку <Play size={16} />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ===== Социальная сеть ===== */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-center text-3xl tracking-wide text-white">
            Своя социальная сеть
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
            Galaux — не просто лаунчер. Сообщество, магазин и продвижение — в
            одном месте.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOCIAL.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="glass card-hover h-full rounded-2xl p-6">
                <f.icon className="text-neon" size={26} />
                <h3 className="mt-4 font-semibold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Реклама проектов ===== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="glass rounded-3xl p-10">
          <Reveal>
            <h2 className="font-display text-3xl tracking-wide text-white">
              Площадка для рекламы своего проекта
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PROMO.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="card-hover h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span className="text-coral">+ </span>
                  <f.icon className="mb-3 inline text-grape" size={22} />
                  <h3 className="font-semibold text-slate-100">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Поддержка модов ===== */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <Reveal>
          <div className="glass rounded-2xl p-6 font-mono text-sm">
            <div className="mb-4 text-slate-500">galaux — загрузка сборки</div>
            <div className="mb-2 flex justify-between">
              <span>modpack: create-neo-1.20.1</span>
              <span className="text-ice">84%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-neon to-grape" />
            </div>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <div>✓ forge-1.20.1-installer.jar</div>
              <div>✓ 214 mods — проверены и скачаны</div>
              <div>✓ конфиги проекта применены</div>
            </div>
          </div>
        </Reveal>
        <div>
          <h2 className="font-display text-3xl tracking-wide text-white">
            Поддержка модов
          </h2>
          <p className="mt-4 text-slate-400">
            Больше никаких многочасовых созвонов с объяснениями, как установить
            модпак. Только созвоны полные веселья и геймплея.
          </p>
          <p className="mt-3 text-slate-300">
            Просто установите модпак через настройки проекта — остальное лаунчер
            сделает сам.
          </p>
        </div>
      </section>

      {/* ===== 3 клика ===== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-center text-3xl tracking-wide text-white">
            Подключение к серверу за пару кликов
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="glass card-hover relative h-full rounded-2xl p-6">
                <span className="font-display absolute right-5 top-4 text-4xl text-white/10">
                  {s.n}
                </span>
                <s.icon className="text-ice" size={26} />
                <h3 className="mt-4 font-semibold text-slate-100">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Блокировки ===== */}
      <section id="support" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="glass flex flex-col items-center gap-6 rounded-3xl p-10 text-center md:flex-row md:text-left">
            <ShieldCheck className="shrink-0 text-emerald-400" size={44} />
            <div>
              <h2 className="font-display text-2xl tracking-wide text-white">
                Система блокировок на вашей стороне
              </h2>
              <p className="mt-3 text-slate-400">
                Баны, муты и whitelist управляются из панели проекта. И даже
                если что-то пойдёт не так — лаунчер сам восстановит файлы сборки
                и вернёт игрока в игру.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== CTA ===== */}
      <section id="contacts" className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-[1px]">
            <div className="absolute inset-0 bg-gradient-to-r from-ice via-deep to-abyss" />
            <div className="relative rounded-3xl bg-void/90 px-8 py-14 text-center">
              <h2 className="font-display text-4xl tracking-wide text-white">
                Запусти. Играй. Создавай.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-400">
                Один аккаунт — все серверы галактики Galaux.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <a href="/download" className="btn-neon">
                  <Download size={18} /> Скачать лаунчер
                </a>
                <Link href="/auth/register" className="btn-ghost">
                  Создать аккаунт
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
