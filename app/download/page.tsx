import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "下载在呢 ZAI NE · 记录此刻",
  description: "下载在呢 ZAI NE 桌面客户端。无需注册，待办、日程、随手记和知识库数据默认只保存在你的电脑。",
};

const macFile = "https://github.com/shenfang055-gif/zaine/releases/download/v0.1.1/zai-ne-0.1.1-macOS-Apple-Silicon.zip";
const windowsFile = "https://github.com/shenfang055-gif/zaine/releases/download/v0.1.1/zai-ne-0.1.1-Windows-x64.exe";

export default function DownloadPage() {
  return <main className="download-page">
    <nav className="download-nav"><a className="download-brand" href="#top"><img src="/xianbieji-app-icon-transparent.png" alt=""/><span><strong>在呢</strong><small>ZAI NE</small></span></a><div><a href="#features">可以做什么</a><a href="#privacy">数据隐私</a><a href="#download">下载</a></div><a className="nav-client" href="#download">下载客户端 ↓</a></nav>

    <section className="download-hero" id="top">
      <div className="download-hero-copy"><div className="download-eyebrow"><span>个人生活记录客户端</span><em>PUBLIC BETA · 0.1.1</em></div><h1>安排生活，<br/><i>也把此刻留下来。</i></h1><p>待办、日历、随手记和知识库，安静地住在你的电脑里。急急急？先别急，先记录此刻。</p><div className="download-actions"><a className="download-main" href={macFile} download><span><strong>下载 macOS 版</strong><small>Apple Silicon · ZIP</small></span><b>↓</b></a><a className="download-main windows" href={windowsFile} download><span><strong>下载 Windows 版</strong><small>Windows 10 / 11 · x64</small></span><b>↓</b></a></div><div className="download-promises"><span>无需注册</span><span>数据保存在本机</span><span>每个人互相独立</span></div></div>
      <div className="download-product"><div className="download-window"><header><i/><i/><i/><span>在呢 · ZAI NE</span></header><iframe src="/" title="在呢客户端界面预览" loading="eager"/></div><div className="download-sticker sticker-one">今天，也有好好生活 ✓</div><div className="download-sticker sticker-two">先记下来<br/>以后慢慢想</div></div>
    </section>

    <section className="download-marquee" aria-label="产品功能"><div><span>待办事项</span><b>✦</b><span>真实日历</span><b>✦</b><span>Markdown 随手记</span><b>✦</b><span>个人知识库</span><b>✦</b><span>本机保存</span><b>✦</b><span>待办事项</span></div></section>

    <section className="download-features" id="features"><header><span>01 / 把一天收好</span><h2>不是催你做更多，<br/>是帮你记得自己。</h2><p>从今天要完成的事，到忽然冒出来的一句话，都有一个自然的位置。</p></header><div className="download-feature-grid"><article className="feature-sage"><small>TO DO</small><h3>待办与日程</h3><p>真实日历、循环日程、截止倒计时，让今天和以后都看得清楚。</p><div className="feature-calendar"><b>15</b><span>今天截止 · 2</span></div></article><article className="feature-clay"><small>QUICK NOTE</small><h3>随手记</h3><p>每条想法独立保存并按时间倒序排列，悬浮入口记下的内容也不会覆盖旧记录。</p><div className="feature-paper"># 今天想到的<br/><i>先写下来，不急着完整。</i></div></article><article className="feature-mist"><small>KNOWLEDGE</small><h3>知识库</h3><p>正式笔记与附件放在一起，支持文本、图片和 PDF 预览。</p><div className="feature-files"><span>研究资料.md</span><span>配色参考.png</span><span>产品方案.pdf</span></div></article></div></section>

    <section className="privacy-section" id="privacy"><div className="privacy-visual"><img src="/xianbieji-app-icon-transparent.png" alt="忙碌却可爱的急急"/><span>“这是你的空间，<br/>别人看不到。”</span></div><div className="privacy-copy"><span>02 / 本地优先</span><h2>不注册，也能安心记。</h2><p>目前版本不连接云端数据库。每个人安装后拥有独立的数据空间，待办、日程、笔记和头像默认只留在自己的电脑里。</p><ul><li><b>不会自动共享</b><span>你和朋友下载的是同一个应用，但看到的是各自的数据。</span></li><li><b>没有账号门槛</b><span>打开就能用，不需要手机号、邮箱或登录。</span></li><li><b>测试版请记得备份</b><span>卸载应用或清理应用数据可能会丢失本地记录。</span></li></ul></div></section>

    <section className="future-section"><span>03 / 接下来</span><h2>以后，在呢也可以<br/>成为朋友之间的小小客厅。</h2><div><p>个人空间 · 每日图文记录 · 好友评论与点赞</p><p>好友地图 · 日程邀请 · 临时位置共享</p></div><small>社交功能上线后，私人数据与主动发布的内容会严格分开。</small></section>

    <section className="download-final" id="download"><div><span>04 / 现在开始</span><h2>急急急？<br/>先别急，先记录此刻。</h2><p>下载在呢 ZAI NE 公开测试版。无需注册，数据默认只保存在这台电脑。</p></div><div className="final-download-list"><a href={macFile} download><span><strong>macOS · Apple Silicon</strong><small>0.1.1 · ZIP</small></span><b>下载 ↓</b></a><a href={windowsFile} download><span><strong>Windows 10 / 11 · x64</strong><small>0.1.1 · EXE</small></span><b>下载 ↓</b></a><div className="release-note"><strong>公开测试版安装提醒</strong><p>当前安装包尚未进行 Apple 与 Microsoft 商店签名，首次打开时系统可能显示安全提醒。</p></div></div></section>

    <footer className="download-footer"><a className="download-brand" href="#top"><img src="/xianbieji-app-icon-transparent.png" alt=""/><span><strong>在呢</strong><small>ZAI NE · 记录此刻</small></span></a><p>慢慢来，比较快。</p><a href="/">打开网页版 →</a></footer>
  </main>;
}
