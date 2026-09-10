#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""跨境谷 DR Radar 仪表盘页面构建器：本地 HTML/CSS/JS -> Base64 loader -> WP REST 更新
用法：python build_page.py   （页面 id 34037）
JS 走 base64（wpautop 会往 script 里注入 <p> 破坏语法）；图表色板经 dataviz validator 验证
（主蓝 #2a78d6 + 高亮橙 #eb6834，CVD ΔE 24.7 全过）"""
import json, base64, io, os, sys, urllib.request

sys.stdout.reconfigure(encoding='utf-8')

css = """
#dr-radar-app{position:relative;left:50%;transform:translateX(-50%);width:calc(100vw - 36px);max-width:960px;margin:24px 0;font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#0b0b0b}
.drr-hero h1{font-size:22px;margin:0 0 6px;color:#0b0b0b}
.drr-hero p{font-size:14px;color:#52514e;margin:0 0 4px}
.drr-asof-line{font-size:12px;color:#898781;margin:0 0 18px}
.drr-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}
.drr-kpi{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:12px 14px}
.drr-kpi .v{font-size:20px;font-weight:700;line-height:1.2}
.drr-kpi .k{font-size:12px;color:#52514e;margin-top:2px}
.drr-sec{margin-bottom:26px}
.drr-sec h4{font-size:15.5px;margin:0 0 2px;color:#0b0b0b}
.drr-sec .sub{font-size:12.5px;color:#898781;margin:0 0 10px}
.drr-chartwrap{position:relative;background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:14px}
.drr-tip{position:fixed;z-index:9999;background:#0b0b0b;color:#fff;font-size:12.5px;padding:6px 10px;border-radius:6px;pointer-events:none;display:none;line-height:1.5}
.drr-table{width:100%;border-collapse:collapse;font-size:13.5px;background:#fff;border:1px solid #e1e0d9;border-radius:10px;overflow:hidden}
.drr-table th{background:#f5f5f2;text-align:left;padding:8px 12px;font-weight:600;border-bottom:2px solid #e1e0d9}
.drr-table td{padding:7px 12px;border-bottom:1px solid #e1e0d9}
.drr-table tr:last-child td{border-bottom:none}
.drr-table td.num{font-variant-numeric:tabular-nums}
.drr-placeholder{border:2px dashed #c3c2b7;border-radius:10px;padding:20px 18px;text-align:center;color:#52514e;font-size:14px;background:#fafaf8}
.drr-ph-strong{font-weight:600;color:#0b0b0b;margin-bottom:4px}
.drr-tool{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:16px;margin-bottom:10px}
.drr-tool h4{font-size:15.5px;margin:0 0 10px}
.drr-form{display:flex;gap:8px;margin-bottom:12px}
.drr-input{flex:1;padding:10px 14px;border:1.5px solid #c3c2b7;border-radius:8px;font-size:14.5px;outline:none}
.drr-input:focus{border-color:#2a78d6}
.drr-btn{padding:10px 20px;background:#2a78d6;color:#fff;border:none;border-radius:8px;font-size:14.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.drr-btn:disabled{opacity:.6;cursor:wait}
.drr-card{border:1px solid #e1e0d9;border-radius:8px;padding:10px 14px;margin-bottom:8px}
.drr-dom{font-weight:700;font-size:15px;margin-bottom:4px}
.drr-main{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.drr-dr{display:inline-block;min-width:66px;text-align:center;padding:4px 9px;border-radius:7px;color:#fff;font-weight:700;font-size:15px}
.drr-gold{background:#b8860b}.drr-teal{background:#0e6e84}.drr-blue{background:#2563eb}.drr-gray{background:#64748b}
.drr-rank{font-size:13.5px;font-weight:600}
.drr-pct{font-size:13px;color:#52514e}
.drr-asof{font-size:11.5px;color:#898781;margin-top:6px;border-top:1px dashed #e1e0d9;padding-top:6px}
.drr-note{font-size:13.5px;color:#52514e;padding:8px 0}
.drr-vetbox{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:16px}
.drr-vetta{width:100%;height:120px;padding:10px 12px;border:1.5px solid #c3c2b7;border-radius:8px;font-size:13.5px;font-family:Consolas,monospace;outline:none;resize:vertical;box-sizing:border-box}
.drr-vetta:focus{border-color:#2a78d6}
.drr-vetbtn{margin-top:10px}
.drr-vetsum{margin-top:12px;font-size:13.5px;font-weight:600}
.drr-vet-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:10px}
.drr-vet-table th{background:#f5f5f2;text-align:left;padding:7px 10px;font-weight:600;border-bottom:2px solid #e1e0d9;white-space:nowrap}
.drr-vet-table td{padding:6px 10px;border-bottom:1px solid #e1e0d9}
.drr-vet-table td.num{font-variant-numeric:tabular-nums}
.tag-a{display:inline-block;background:#e7f4ec;color:#0a6b2d;border:1px solid #bfe3cd;border-radius:4px;padding:0 7px;font-size:12px;font-weight:600;white-space:nowrap}
.tag-b{display:inline-block;background:#eaf3f6;color:#0a5263;border:1px solid #c2dae2;border-radius:4px;padding:0 7px;font-size:12px;white-space:nowrap}
.tag-c{display:inline-block;background:#faf6ec;color:#77590f;border:1px solid #e3d6a8;border-radius:4px;padding:0 7px;font-size:12px;white-space:nowrap}
.tag-d{display:inline-block;background:#f9efeb;color:#a34a33;border:1px solid #e6cdc3;border-radius:4px;padding:0 7px;font-size:12px;font-weight:600;white-space:nowrap}
.drr-subsec{margin-top:16px}
.drr-subsec h5{font-size:14px;margin:0 0 2px;color:#0b0b0b}
.drr-duo{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.drr-duo .drr-subsec{margin-top:0}
@media(max-width:860px){.drr-duo{grid-template-columns:1fr}}
.drr-usegrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.drr-use{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:14px 16px}
.drr-use h5{font-size:14.5px;margin:0 0 6px;color:#0b0b0b}
.drr-use p{font-size:13px;color:#52514e;margin:0;line-height:1.7}
.drr-finds{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:16px 18px}
.drr-finds p{font-size:13.5px;color:#52514e;margin:0 0 10px;line-height:1.75}
.drr-finds p:last-child{margin-bottom:0}
.drr-faq{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:16px 18px}
.drr-faq p{font-size:13.5px;color:#52514e;margin:0 0 10px;line-height:1.75}
.drr-faq p:last-child{margin-bottom:0}
.drr-det{background:#fff;border:1px solid #e1e0d9;border-radius:10px;margin-bottom:8px;overflow:hidden}
.drr-det summary{padding:12px 16px;font-size:14px;font-weight:600;color:#0b0b0b;cursor:pointer;list-style:none;position:relative}
.drr-det summary::-webkit-details-marker{display:none}
.drr-det summary::after{content:"+";position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:18px;color:#898781}
.drr-det[open] summary::after{content:"−"}
.drr-det[open] summary{border-bottom:1px solid #e1e0d9}
.drr-detbody{padding:12px 16px}
.drr-detbody p{font-size:13.5px;color:#52514e;margin:0;line-height:1.75}
.drr-foot{font-size:12px;color:#898781;margin-top:14px}
@media(max-width:640px){.drr-kpis{grid-template-columns:repeat(2,1fr)}.drr-form{flex-direction:column}}
"""

js = r"""(function(){
var API='https://dr-radar.lzn184205909.workers.dev';
var C={blue:'#2a78d6',orange:'#eb6834',ink:'#0b0b0b',sub:'#52514e',muted:'#898781',grid:'#e1e0d9',base:'#c3c2b7'};
var app=document.getElementById('dr-radar-app');
if(!app)return;
var tip=document.createElement('div');tip.className='drr-tip';document.body.appendChild(tip);
function showTip(e,html){tip.innerHTML=html;tip.style.display='block';moveTip(e)}
function moveTip(e){var x=e.clientX+14,y=e.clientY+14;var r=tip.getBoundingClientRect();if(x+r.width>window.innerWidth-8)x=e.clientX-r.width-10;if(y+r.height>window.innerHeight-8)y=e.clientY-r.height-10;tip.style.left=x+'px';tip.style.top=y+'px'}
function hideTip(){tip.style.display='none'}
function fmt(n){return n.toLocaleString('en-US')}
function svgEl(w,h){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 '+w+' '+h);s.setAttribute('width','100%');s.style.display='block';return s}
function txt(x,y,t,fill,size,anchor,weight){var e=document.createElementNS('http://www.w3.org/2000/svg','text');e.setAttribute('x',x);e.setAttribute('y',y);e.setAttribute('fill',fill||C.muted);e.setAttribute('font-size',size||11);e.setAttribute('text-anchor',anchor||'middle');if(weight)e.setAttribute('font-weight',weight);e.textContent=t;return e}
function rect(x,y,w,h,fill,rt){var r=document.createElementNS('http://www.w3.org/2000/svg','rect');r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',Math.max(w,0.5));r.setAttribute('height',Math.max(h,0));r.setAttribute('fill',fill);if(rt&&h>3){r.setAttribute('rx',Math.min(3,w/2))}return r}
function hline(s,x1,y1,x2,y2){var l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);l.setAttribute('stroke',C.grid);l.setAttribute('stroke-width',1);s.appendChild(l)}
function attach(el,eGet){el.addEventListener('mouseenter',function(e){showTip(e,eGet())});el.addEventListener('mousemove',moveTip);el.addEventListener('mouseleave',hideTip)}

function histChart(data){
  var W=540,H=280,L=56,R=10,T=16,B=34,pw=W-L-R,ph=H-T-B;
  var max=Math.max.apply(null,data.map(function(d){return d.count}));
  var bw=pw/data.length;
  var s=svgEl(W,H);
  [0,.25,.5,.75,1].forEach(function(f){var y=T+ph-ph*f;hline(s,L,y,W-R,y);s.appendChild(txt(L-6,y+3,fmt(Math.round(max*f)),C.muted,10,'end'))});
  data.forEach(function(d,i){
    var x=L+i*bw+2,w=bw-4,h=ph*d.count/max;
    var bar=rect(x,T+ph-h,w,h,C.blue,true);
    attach(bar,function(){return d.label+'：'+fmt(d.count)+' 个域名（'+(d.count/995023*100).toFixed(1)+'%）'});
    s.appendChild(bar);
    s.appendChild(txt(x+w/2,H-14,d.label.replace('DR',''),C.muted,10));
  });
  var peak=data.reduce(function(a,b){return a.count>b.count?a:b});
  var pi=data.indexOf(peak);
  s.appendChild(txt(L+pi*bw+bw/2,T+ph-ph*peak.count/max-8,fmt(peak.count),C.sub,11,'middle','600'));
  return s;
}

function tldChart(data){
  var W=540,rowH=30,T=4,L=92,R=96,pw=W-L-R,H=data.length*rowH+T+8;
  var max=data[0].count;
  var s=svgEl(W,H);
  data.forEach(function(d,i){
    var y=T+i*rowH,w=pw*d.count/max;
    s.appendChild(txt(L-8,y+14,d.label,C.sub,12,'end'));
    var bar=rect(L,y+6,w,rowH-14,C.blue,true);
    attach(bar,function(){return d.label+'：'+fmt(d.count)+' 个（'+d.pct+'%）'});
    s.appendChild(bar);
    s.appendChild(txt(L+w+6,y+15,fmt(d.count)+' · '+d.pct+'%',C.sub,11,'start'));
  });
  return s;
}

function susChart(data){
  var W=720,H=240,L=44,R=10,T=18,B=34,pw=W-L-R,ph=H-T-B;
  var max=Math.ceil(Math.max.apply(null,data.map(function(d){return d.pct})));
  var bw=pw/data.length;
  var s=svgEl(W,H);
  for(var f=0;f<=max;f++){var y=T+ph-ph*f/max;hline(s,L,y,W-R,y);s.appendChild(txt(L-6,y+3,f+'%',C.muted,10,'end'))}
  data.forEach(function(d,i){
    var x=L+i*bw+3,w=bw-6,h=ph*d.pct/max;
    var hot=d.label==='DR70-79';
    var bar=rect(x,T+ph-h,w,h,hot?C.orange:C.blue,true);
    attach(bar,function(){return d.label+'：'+fmt(d.sus)+' / '+fmt(d.total)+' 个域名可疑（'+d.pct+'%）'});
    s.appendChild(bar);
    s.appendChild(txt(x+w/2,H-14,d.label,C.muted,10));
    if(hot){s.appendChild(txt(x+w/2,T+ph-h-8,d.pct+'% 峰值','#b84a10',11,'middle','600'))}
  });
  return s;
}

function render(st){
  var k=st.kpis;
  var kv=app.querySelector('.drr-kpis');
  kv.innerHTML='';
  var items=[[fmt(st.meta.total),'入榜域名总数'],['DR '+k.dr_floor,'入榜权威门槛'],[k.sus_pct+'% · '+fmt(k.sus_total)+' 个','可疑域名（数字名/垃圾TLD）'],['.com '+k.com_pct+'%','单一注册局垄断占比']];
  items.forEach(function(p){
    var d=document.createElement('div');d.className='drr-kpi';
    var v=document.createElement('div');v.className='v';v.textContent=p[0];
    var t=document.createElement('div');t.className='k';t.textContent=p[1];
    d.appendChild(v);d.appendChild(t);kv.appendChild(d);
  });
  app.querySelector('.drr-c1').appendChild(histChart(st.dr_dist));
  app.querySelector('.drr-c2').appendChild(tldChart(st.tld_top));
  app.querySelector('.drr-c3').appendChild(susChart(st.sus_density));
  var tb=app.querySelector('.drr-dec-tb');tb.innerHTML='';
  st.deciles.forEach(function(d){
    var tr=document.createElement('tr');
    var t1=document.createElement('td');t1.textContent=d.label;
    var t2=document.createElement('td');t2.className='num';t2.textContent=d.range;
    var t3=document.createElement('td');t3.className='num';t3.textContent='DR ≥ '+d.dr_min;
    tr.appendChild(t1);tr.appendChild(t2);tr.appendChild(t3);tb.appendChild(tr);
  });
  app.querySelector('.drr-asof-line').textContent='首期基线快照：'+st.meta.as_of+' · 共 '+fmt(st.meta.total)+' 个域名 · '+st.meta.source;
}

var vta=app.querySelector('.drr-vetta'),vtb=app.querySelector('.drr-vetbtn'),vsum=app.querySelector('.drr-vetsum'),vres=app.querySelector('.drr-vetres');
function verdict(r){
  if(r.sus)return['tag-d','避开：批量灌制特征'];
  if(!r.in_top1m)return['tag-c','价值低：未进 Top100万'];
  if(r.rank<100000)return['tag-a','优质：全球前10万'];
  if(r.rank<300000)return['tag-b','可用：中坚档'];
  if(r.rank<500000)return['tag-c','一般：权衡价格'];
  return['tag-c','价值低：尾部'];
}
function vet(){
  var list=vta.value.split(/[,，\s\n;；]+/).map(function(s){return s.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0]}).filter(Boolean).slice(0,200);
  if(!list.length){vsum.textContent='请输入域名';vres.innerHTML='';return}
  vtb.disabled=true;vtb.textContent='验资中…';vsum.textContent='';vres.innerHTML='';
  fetch(API+'/api?domains='+encodeURIComponent(list.join(','))).then(function(r){return r.json()}).then(function(data){
    var arr=data.results||[];
    var good=0,mid=0,avoid=0;
    var rows=arr.map(function(r){
      var v=verdict(r);
      if(v[0]==='tag-a')good++;else if(v[0]==='tag-b')mid++;else if(v[0]==='tag-d')avoid++;
      return '<tr><td>'+r.domain+'</td><td class="num">'+(r.in_top1m?('DR '+Math.round(r.dr)):'—')+'</td><td class="num">'+(r.in_top1m?('#'+fmt(r.rank)):'—')+'</td><td class="num">'+(r.in_top1m?(100-r.top_percent).toFixed(2)+'%':'—')+'</td><td><span class="'+v[0]+'">'+v[1]+'</span></td></tr>';
    }).join('');
    vsum.textContent='共 '+arr.length+' 个：优质 '+good+'｜可用 '+mid+'｜价值低 '+(arr.length-good-mid-avoid)+'｜建议避开 '+avoid;
    vres.innerHTML='<table class="drr-vet-table"><thead><tr><th>域名</th><th>DR</th><th>全球排名</th><th>百分位</th><th>结论</th></tr></thead><tbody>'+rows+'</tbody></table><div class="drr-asof" style="margin-top:8px">快照 '+(arr[0]&&arr[0].as_of||'')+' · Domain Rating by Ahrefs</div>';
  }).catch(function(){vsum.textContent='查询失败，请稍后重试'}).finally(function(){vtb.disabled=false;vtb.textContent='开始验资'});
}
vtb.addEventListener('click',vet);

fetch(API+'/api/stats').then(function(r){return r.json()}).then(render).catch(function(){
  app.querySelector('.drr-kpis').innerHTML='<div class="drr-note">数据加载失败，请刷新重试</div>';
});
})();"""

b64 = base64.b64encode(js.encode('utf-8')).decode('ascii')

html = ('<div id="dr-radar-app">\n<style>' + css + '</style>\n'
  '<div class="drr-hero">\n<h1>全球网站权威生态雷达</h1>\n'
  '<p>全球 Top 1,000,000 域名权威榜的数据处理视图。<strong>本页怎么用：</strong>① 手里有外链资源清单 → 直接用下方「批量验资」出报告；② 想知道某个 DR 值值多少钱 → 看换算表；③ 生态图表是背景参考；④ 每月 diff 报告（崛起/掉榜）10 月上线后成为主入口。单域名实时查询请用 <a href="/tools/dr-checker/" style="color:#2a78d6">DR Checker</a>。</p>\n'
  '<p class="drr-asof-line">加载中…</p>\n</div>\n\n'
  '<div class="drr-sec">\n<h4>批量外链验资（可行动输出）</h4>\n'
  '<p class="sub">把外链服务商给你的资源清单、或你想合作/收购的域名列表贴进来（≤200 个）——逐个出权威档位、风险标记和采购建议</p>\n'
  '<div class="drr-vetbox">\n'
  '<textarea class="drr-vetta" placeholder="每行一个域名，或逗号分隔，最多 200 个&#10;例：&#10;someblog.com&#10;8100736.xyz&#10;medium.com"></textarea>\n'
  '<button class="drr-btn drr-vetbtn">开始验资</button>\n'
  '<div class="drr-vetsum"></div>\n'
  '<div class="drr-vetres"></div>\n'
  '</div>\n</div>\n\n'
  '<div class="drr-sec">\n<h4>DR 换算表：你的 DR 值多少钱</h4>\n'
  '<p class="sub">每个全球位次区间的最低权威门槛——验资报告的档位依据</p>\n'
  '<table class="drr-table"><thead><tr><th>区间</th><th>全球排名范围</th><th>入榜门槛</th></tr></thead><tbody class="drr-dec-tb"></tbody></table>\n</div>\n\n'
  '<div class="drr-sec drr-overview">\n<h4>生态概览（背景参考）</h4>\n'
  '<p class="sub">首期快照的全景统计——权威分布 / 注册局结构 / 异常聚集</p>\n'
  '<div class="drr-kpis"></div>\n'
  '<div class="drr-duo">\n'
  '<div class="drr-subsec"><h5>权威金字塔：DR 分布</h5>\n'
  '<p class="sub">DR45-49 一档 25.9 万个域名，DR95+ 全球仅 45 个</p>\n'
  '<div class="drr-chartwrap drr-c1"></div></div>\n'
  '<div class="drr-subsec"><h5>注册局结构：TLD Top 10</h5>\n'
  '<p class="sub">.com 一家独大占四成，.xyz 以 2.9 万个挤进前五</p>\n'
  '<div class="drr-chartwrap drr-c2"></div></div>\n'
  '</div>\n'
  '<div class="drr-subsec"><h5>异常聚集：可疑域名密度</h5>\n'
  '<p class="sub">纯数字域名 + 垃圾 TLD 在各权威区间的占比——DR70-79 段峰值是批量灌制聚集区</p>\n'
  '<div class="drr-chartwrap drr-c3"></div></div>\n'
  '</div>\n\n'
  '<div class="drr-sec">\n<h4>月度生态雷达（主产出）</h4>\n'
  '<p class="sub">逐月对比全量榜单：高起点新进榜=有资金在推的新生意（选品信号）/ 掉榜=崩塌警报（避坑+切入窗口）</p>\n'
  '<div class="drr-placeholder">\n<div class="drr-ph-strong">首份月度报告：2026-10 解锁</div>\n'
  '本月为首期基线（Ahrefs 免费接口无历史快照，已实测确认）。下月起自动 diff 两期全量数据，产出崛起榜与掉榜警报，每条附「为什么值得关注」解读。\n</div>\n</div>\n\n'
  '<div class="drr-sec">\n<h4>这些数据怎么用：三个场景</h4>\n<p class="sub">跨境卖家 / SEO 从业者的实操用法</p>\n'
  '<div class="drr-usegrid">\n'
  '<div class="drr-use"><h5>外链验资</h5><p>交换或购买外链前，先查对方域名的全球百分位：rank 前 50 万（约 DR55+）才值得投入；高 DR 但落在可疑聚集区的域名（纯数字名 / .xyz 系）大概率是批量灌制的假权威，一律避开。</p></div>\n'
  '<div class="drr-use"><h5>竞对权威定位</h5><p>给竞争对手建档时，用 DR + 全球排名双口径衡量其词表难度：对手 DR70+ 意味着它的核心词短期抢不动，应转向它未覆盖的长尾词族（参考换算表定位）。</p></div>\n'
  '<div class="drr-use"><h5>域名购买尽调</h5><p>买老域名建站前，先用本页速查验证其权威真实性：DR 高但查不到自然流量的域名，多半是靠 301 重定向和灌制外链堆出来的——Google 不认，买来即踩坑。</p></div>\n'
  '</div>\n</div>\n\n'
  '<div class="drr-sec">\n<h4>本期发现（首期基线）</h4>\n<p class="sub">2026-09 快照的三个数据洞察</p>\n'
  '<div class="drr-finds">\n'
  '<p><strong>① 权威是极端稀缺资源：</strong>99.5 万个入榜域名中，DR50 以下占 55%——一半以上的"权威域名"其实处在金字塔最底层；DR95+ 全球仅 45 个，全是 facebook / google 级别。</p>\n'
  '<p><strong>② DR70-79 存在异常聚集：</strong>纯数字域名和 .xyz/.cyou/.icu 域名在该区间占比 4.1%，显著高于 DR90+ 区间的 0.3%——批量注册+灌制外链的"权威工厂"集中在这个性价比区间出货。</p>\n'
  '<p><strong>③ .com 垄断四成：</strong>Top 1M 中 .com 占 40.3%，第二名 .org 仅 8.4%——注册局层面的赢家通吃。</p>\n'
  '</div>\n</div>\n\n'
  '<div class="drr-sec">\n<h4>常见问题与 SEO 指南</h4>\n'
  '<details class="drr-det"><summary>什么是 Domain Rating（DR）？</summary><div class="drr-detbody"><p>Domain Rating 是 Ahrefs 定义的域名权威指标，取值 0-100。计算逻辑：统计有多少独立域名以 dofollow 方式链接到目标域名，再看这些来源域名自身的权威高低——被高权威站引用越多，DR 越高。它衡量的是"外链资产厚度"，不是流量，也不是 Google 官方的任何评分。</p></div></details>\n'
  '<details class="drr-det"><summary>DR 排名和流量排名是一回事吗？</summary><div class="drr-detbody"><p>不是。本站的全球排名按 DR（被链接程度）排序：temu 流量位居全球前列，但在权威榜第 5,665 位；shopify 权威榜第 21 位。新站可以在几个月内做出可观流量，但权威需要常年外链积累。评估竞争对手时，流量数据告诉你它现在赚不赚钱，DR 告诉你它的词表防御工事有多厚。</p></div></details>\n'
  '<details class="drr-det"><summary>DR 多少算好？值多少钱？</summary><div class="drr-detbody"><p>参考换算表：DR ≥ 71 才能进全球前 10 万，DR ≥ 54 进前 50 万。对跨境独立站：DR 30-50 属于健康增长区间；DR 60+ 通常意味着有真实的行业媒体与资源页引用；DR 70+ 是行业头部或多年品牌站。购买外链时，DR 60+ 且排名前 30 万的资源值得谈判，DR 55 以下对权威建设贡献有限。</p></div></details>\n'
  '<details class="drr-det"><summary>如何安全地提升 DR？</summary><div class="drr-detbody"><p>三条正路：① 行业相关的内容资产（数据报告/工具页）自然吸引引用——本站就是这种打法；② 数字公关（PR）获得媒体报道外链；③ 客座文章与资源页合作，优先 DR 60+ 且主题相关的站点。要避免的：购买批量灌制的"高 DR"外链（纯数字域名/.xyz 系多为灌制网络，Google 不认可）、PBN 私博网络、以及任何承诺"30 天 DR 70"的服务——那是灌制或 301 作弊，短期数字好看，长期连累整站。</p></div></details>\n'
  '<details class="drr-det"><summary>为什么有些高 DR 网站不能买？</summary><div class="drr-detbody"><p>DR 可以被人为灌高：批量注册域名互相灌 dofollow 链、或买入老域名做 301 重定向，都能在 1-3 个月内把 DR 刷到 60-70。识别方法：看域名形态（纯数字名、.xyz/.cyou/.icu 后缀）、查外链来源是否全是零流量小站。本页的批量验资功能内置了这套检测——贴入域名清单即可自动标记。</p></div></details>\n'
  '<details class="drr-det"><summary>数据来源与更新频率</summary><div class="drr-detbody"><p>数据来源：Domain Rating by Ahrefs（免费接口，每月全量快照）。本站每月 1 日刷新全量 99.5 万域名数据，并发布月度变化报告：高起点新进榜域名（有资金在推广的新生意信号）、掉榜警报（被惩罚或外链崩塌）、权威跃迁名单。单域名实时查询请使用 <a href="/tools/dr-checker/" style="color:#2a78d6">DR Checker 实时版</a>。</p></div></details>\n'
  '</div>\n\n'
  '<div class="drr-foot">数据来源：Domain Rating by Ahrefs · 全量 99.5 万域名本地处理 · 每月刷新 · 实时查询请用 <a href="/tools/dr-checker/" style="color:#2a78d6">DR Checker 实时版</a>；更多工具见 <a href="/tools/seo-tools/" style="color:#2a78d6">SEO 与域名工具</a></div>\n'
  '</div>\n<script>eval(new TextDecoder().decode(Uint8Array.from(atob("' + b64 + '"),function(c){return c.charCodeAt(0)})))</script>')

payload = {"title": "全球网站权威生态雷达（数据月报）", "content": html}
io.open('page_payload.json', 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False))
print('page payload ready:', len(html), 'bytes')

# WP 更新
ENV = {}
for line in io.open(os.path.expanduser('~/.env'), encoding='utf-8'):
    if '=' in line and not line.strip().startswith('#'):
        k, v = line.strip().split('=', 1)
        ENV[k] = v.strip('"')
req = urllib.request.Request(
    'https://kuajinggu.com/wp-json/wp/v2/pages/34037',
    data=io.open('page_payload.json', 'rb').read(), method='POST',
    headers={'Authorization': 'Basic ' + base64.b64encode((ENV['WP_USER_KUAJINGGU'] + ':' + ENV['WP_APP_PASS_KUAJINGGU']).encode()).decode(),
             'Content-Type': 'application/json; charset=utf-8'},
)
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
    d = json.load(r)
    print('WP updated: id', d.get('id'), '| status', d.get('status'), '| link', d.get('link'))
