interface DisclaimerPageProps {
  lastUpdated: string;
}

export function DisclaimerPage({ lastUpdated }: DisclaimerPageProps) {
  return (
    <section className="content-page">
      <p className="eyebrow">Disclaimer</p>
      <h1>免责声明</h1>
      <article className="document-panel">
        <p className="document-date">最后更新：{lastUpdated}</p>
        <section>
          <h2>一、内容来源</h2>
          <p>本站展示的游戏信息、封面、截图、标签、评分及外部链接仅用于目录整理、作品介绍和学习交流。示例数据不代表真实授权关系，正式上线前应替换为你拥有合法使用权的数据与图片资源。</p>
        </section>
        <section>
          <h2>二、外部链接</h2>
          <p>本站可能包含下载页面、官方网站、在线游玩入口等外部链接。外部网站的内容、可用性、安全性与合规性由对应站点负责，本站不对外部链接产生的结果承担责任。</p>
        </section>
        <section>
          <h2>三、版权归属</h2>
          <p>游戏名称、商标、角色、图片及相关素材版权归原权利人所有。如权利人认为本站内容涉及侵权，可联系站点维护者进行核实与移除。</p>
        </section>
        <section>
          <h2>四、使用风险</h2>
          <p>用户访问外部链接、下载文件或启动游戏前，应自行确认来源可信、内容合规，并遵守所在地区法律法规及对应平台条款。</p>
        </section>
        <section>
          <h2>五、声明变更</h2>
          <p>本站维护者可根据站点内容、托管平台规则或相关合规要求调整本免责声明。更新后的内容将在本页面展示，并自发布时起生效。</p>
        </section>
      </article>
    </section>
  );
}
