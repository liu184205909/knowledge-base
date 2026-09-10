#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""DR Checker 独立页（slug=dr-checker）：Ahrefs 实时 DR 直查 + 在榜域名附全球排名
用法：python build_checker_page.py（创建或更新页面，slug 定位）"""
import json, base64, io, os, sys, subprocess

sys.stdout.reconfigure(encoding='utf-8')

css = """
#dr-checker-app{position:relative;left:50%;transform:translateX(-50%);width:calc(100vw - 36px);max-width:860px;margin:24px 0;font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#0b0b0b}
.drc-hero h1{font-size:22px;margin:0 0 6px}
.drc-hero p{font-size:14px;color:#52514e;margin:0 0 18px}
.drc-form{display:flex;gap:8px;margin-bottom:16px}
.drc-input{flex:1;padding:12px 14px;border:1.5px solid #c3c2b7;border-radius:8px;font-size:15px;outline:none}
.drc-input:focus{border-color:#2a78d6}
.drc-btn{padding:12px 24px;background:#2a78d6;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;white-space:nowrap}
.drc-btn:disabled{opacity:.6;cursor:wait}
.drc-card{background:#fff;border:1px solid #e1e0d9;border-radius:12px;padding:20px 22px;margin-bottom:10px}
.drc-dom{font-size:17px;font-weight:700;margin-bottom:10px}
.drc-main{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.drc-dr{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;min-width:96px;padding:10px 12px;border-radius:12px;color:#fff}
.drc-dr .n{font-size:34px;font-weight:800;line-height:1}
.drc-dr .l{font-size:11px;margin-top:2px;opacity:.9}
.drc-gold{background:#b8860b}.drc-teal{background:#0e6e84}.drc-blue{background:#2563eb}.drc-gray{background:#64748b}.drc-zero{background:#8a94a0}
.drc-side{display:flex;flex-direction:column;gap:4px}
.drc-rank{font-size:14.5px;font-weight:600}
.drc-pct{font-size:13px;color:#52514e}
.drc-note{font-size:13.5px;color:#52514e}
.drc-asof{font-size:12px;color:#898781;margin-top:12px;border-top:1px dashed #e1e0d9;padding-top:8px}
.drc-tip{background:#f5f8fb;border:1px solid #dbe7f3;border-radius:10px;padding:12px 16px;font-size:13px;color:#52514e;line-height:1.7;margin-top:14px}
.drc-foot{font-size:12px;color:#898781;margin-top:14px}
@media(max-width:600px){.drc-form{flex-direction:column}}
"""

js = r"""(function(){
var API='https://dr-radar.lzn184205909.workers.dev/api/live';
var app=document.getElementById('dr-checker-app');
if(!app)return;
var input=app.querySelector('.drc-input'),btn=app.querySelector('.drc-btn'),box=app.querySelector('.drc-results');
function fmt(n){return n.toLocaleString('en-US')}
function cls(dr){return dr>=85?'drc-gold':dr>=70?'drc-teal':dr>=50?'drc-blue':dr>=1?'drc-gray':'drc-zero'}
function go(){
  var d=input.value.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];
  box.innerHTML='';
  if(!d){box.innerHTML='<div class="drc-note">请输入域名</div>';return}
  btn.disabled=true;btn.textContent='查询中…';
  fetch(API+'?domain='+encodeURIComponent(d)).then(function(r){return r.json()}).then(function(data){
    box.innerHTML='';
    var c=document.createElement('div');c.className='drc-card';
    var h=document.createElement('div');h.className='drc-dom';h.textContent=data.domain;c.appendChild(h);
    if(data.error){var e=document.createElement('div');e.className='drc-note';e.textContent=data.error;c.appendChild(e);box.appendChild(c);return}
    var m=document.createElement('div');m.className='drc-main';
    var dr=document.createElement('span');dr.className='drc-dr '+cls(data.dr||0);
    var n=document.createElement('span');n.className='n';n.textContent=data.dr==null?'?':Math.round(data.dr);
    var l=document.createElement('span');l.className='l';l.textContent='Domain Rating';
    dr.appendChild(n);dr.appendChild(l);m.appendChild(dr);
    if(data.in_top1m){
      var side=document.createElement('div');side.className='drc-side';
      var rk=document.createElement('div');rk.className='drc-rank';rk.textContent='全球权威榜第 '+fmt(data.rank)+' 位';
      var pc=document.createElement('div');pc.className='drc-pct';var b=100-data.top_percent;pc.textContent='超越全球 '+(b<1?b.toFixed(4):b.toFixed(2))+'% 的域名（快照 '+data.as_of+'）';
      side.appendChild(rk);side.appendChild(pc);m.appendChild(side);
    }else{
      var s=document.createElement('div');s.className='drc-pct';s.textContent='未进入全球 Top 100 万权威榜';
      m.appendChild(s);
    }
    c.appendChild(m);
    var a=document.createElement('div');a.className='drc-asof';a.textContent='实时数据 · Domain Rating by Ahrefs';c.appendChild(a);
    box.appendChild(c);
  }).catch(function(){box.innerHTML='<div class="drc-note">查询失败，请稍后重试</div>'}).finally(function(){btn.disabled=false;btn.textContent='立即查询'});
}
btn.addEventListener('click',go);
input.addEventListener('keydown',function(e){if(e.key==='Enter')go()});
})();"""

b64 = base64.b64encode(js.encode('utf-8')).decode('ascii')

html = ('<div id="dr-checker-app">\n<style>' + css + '</style>\n'
  '<div class="drc-hero">\n<h1>DR Checker · 实时域名权威查询</h1>\n'
  '<p>直连 Ahrefs 官方数据接口，实时返回任意域名的 Domain Rating（0-100）；进入全球权威榜的域名，额外附赠全球排名与百分位。</p>\n</div>\n'
  '<div class="drc-form"><input class="drc-input" type="text" placeholder="输入域名，如 yourstore.com"><button class="drc-btn">立即查询</button></div>\n'
  '<div class="drc-results"></div>\n'
  '<div class="drc-tip"><strong>DR 怎么读：</strong>DR 70+ 为高权威（全球约 10 万个）；50-69 为中坚；DR &lt;45 表示尚未进入全球 Top 100 万权威榜。'
  '外链合作、竞对分析、域名购买前都值得先查一下。深度数据视图见 <a href="/tools/dr-radar/" style="color:#2a78d6">全球网站权威生态雷达</a>；更多工具见 <a href="/tools/seo-tools/" style="color:#2a78d6">SEO 与域名工具分类</a>。</div>\n'
  '<div class="drc-foot">数据来源：Domain Rating by Ahrefs（实时）· 全球排名为月度快照 · 每分钟限 8 次查询</div>\n'
  '</div>\n<script>eval(new TextDecoder().decode(Uint8Array.from(atob("' + b64 + '"),function(c){return c.charCodeAt(0)})))</script>')

payload = {"title": "DR Checker 实时域名权威查询", "slug": "dr-checker", "status": "publish", "content": html}
io.open('checker_payload.json', 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False))
print('checker payload ready:', len(html))
