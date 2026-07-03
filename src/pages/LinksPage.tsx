import { ArrowSquareOut } from '@phosphor-icons/react';
import friendData from '../data/friendLinks.json';
import type { FriendLinksData } from '../types/game';

const friendLinksData = friendData as FriendLinksData;

export function LinksPage() {
  return (
    <section className="content-page">
      <p className="eyebrow">Friend links</p>
      <h1>友情链接</h1>
      <p className="content-intro">这里用于放置相关站点、资料库、发行平台或合作伙伴链接。后续只需要修改数组数据即可更新展示内容。</p>
      <div className="links-grid">
        {friendLinksData.links.map((link) => (
          <a key={link.url} className="friend-card" href={link.url} target="_blank" rel="noreferrer">
            <img src={link.favicon} alt="" aria-hidden="true" />
            <span>{link.name}</span>
            <p>{link.description}</p>
            <ArrowSquareOut size={18} weight="bold" />
          </a>
        ))}
      </div>
    </section>
  );
}
