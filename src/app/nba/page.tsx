export const dynamic = "force-dynamic";

// NBA 球队信息 - 独行侠
const MAVERICKS_INFO = {
  name: "达拉斯独行侠",
  englishName: "Dallas Mavericks",
  abbreviations: "DAL",
  conference: "西部",
  division: "西南赛区",
  founded: 1980,
  arena: "美航中心球馆",
  colors: {
    navy: "#002B5E",
    royal: "#0053BC",
    silver: "#B8C4CA",
  },
};

export default async function NBAPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头部 */}
      <section className="mb-8 rounded-lg overflow-hidden" style={{ backgroundColor: MAVERICKS_INFO.colors.navy }}>
        <div className="p-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">🏀 {MAVERICKS_INFO.name}</h1>
          <p className="text-lg opacity-90">{MAVERICKS_INFO.englishName}</p>
          <div className="mt-4 flex justify-center gap-4 text-sm opacity-75">
            <span>{MAVERICKS_INFO.conference} | {MAVERICKS_INFO.division}</span>
            <span>•</span>
            <span>成立于 {MAVERICKS_INFO.founded}</span>
            <span>•</span>
            <span>{MAVERICKS_INFO.arena}</span>
          </div>
        </div>
      </section>

      {/* 快速链接 */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <a
          href="https://www.nba.com/mavericks"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-lg border-2 transition-colors hover:border-[var(--color-mavericks-royal)]"
        >
          <h3 className="text-xl font-semibold mb-2">🔗 独行侠官网</h3>
          <p className="text-muted-foreground">访问达拉斯独行侠官方网站</p>
        </a>
        <a
          href="https://www.nba.com/schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-lg border-2 transition-colors hover:border-[var(--color-mavericks-royal)]"
        >
          <h3 className="text-xl font-semibold mb-2">📅 NBA 赛程</h3>
          <p className="text-muted-foreground">查看 NBA 官方赛程和比分</p>
        </a>
        <a
          href="https://www.espn.com/nba/team/_/name/dal/dallas-mavericks"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-lg border-2 transition-colors hover:border-[var(--color-mavericks-royal)]"
        >
          <h3 className="text-xl font-semibold mb-2">📰 球队新闻</h3>
          <p className="text-muted-foreground">ESPN 独行侠相关新闻</p>
        </a>
      </section>

      {/* 球队颜色展示 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🎨 球队配色</h2>
        <div className="flex gap-4">
          <div
            className="flex-1 h-24 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: MAVERICKS_INFO.colors.navy }}
          >
            海军蓝 #002B5E
          </div>
          <div
            className="flex-1 h-24 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: MAVERICKS_INFO.colors.royal }}
          >
            皇家蓝 #0053BC
          </div>
          <div
            className="flex-1 h-24 rounded-lg flex items-center justify-center text-gray-800 font-medium"
            style={{ backgroundColor: MAVERICKS_INFO.colors.silver }}
          >
            银灰色 #B8C4CA
          </div>
        </div>
      </section>

      {/* RSS 订阅源 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📡 NBA 资讯订阅</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">ESPN NBA 头条</h3>
            <a
              href="https://www.espn.com/espn/rss/nba/news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-mavericks-royal)] hover:underline"
            >
              https://www.espn.com/espn/rss/nba/news
            </a>
          </div>
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">独行侠新闻</h3>
            <a
              href="https://www.mavs.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-mavericks-royal)] hover:underline"
            >
              https://www.mavs.com/feed/
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
