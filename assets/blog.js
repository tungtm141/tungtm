/* Blog — dùng chung cho /blog, mọi bài viết và mục chủ đề trên trang chủ.
   Danh sách bài lấy từ /blog/posts.json (nguồn duy nhất). */
(function(){
  var root=document.documentElement;

  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function pick(o,l){ if(!o) return ""; if(typeof o==="string") return o; return o[l]||o.vi||o.en||""; }

  /* Ngôn ngữ: mặc định VI, không lưu lựa chọn (giống các trang khác) */
  function setLang(l){
    root.setAttribute("data-lang",l); root.setAttribute("lang",l);
    document.querySelectorAll(".lang button").forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-set")===l));});
    var t=root.getAttribute("data-title-"+l); if(t) document.title=t;
    render();
  }
  document.querySelectorAll(".lang button").forEach(function(b){
    b.addEventListener("click",function(){setLang(b.getAttribute("data-set"));});
  });

  /* Chủ đề (6 trụ cột) — thứ tự hiển thị cố định, khớp trường "topic" trong posts.json */
  var TOPICS=[
    {k:"A",id:"contact-center",vi:"Contact Center & vòng đời",en:"Contact Center & lifecycle",
     dvi:"Vòng đời hỗ trợ, nâng cấp, hạ tầng và rollback cho tổng đài.",den:"Support lifecycle, upgrades, infrastructure and rollback for contact centers."},
    {k:"B",id:"crm-omnichannel",vi:"CRM & Omnichannel",en:"CRM & Omnichannel",
     dvi:"Hồ sơ khách hàng, lịch sử tương tác, ticket và tích hợp với tổng đài.",den:"Customer records, interaction history, tickets and contact center integration."},
    {k:"C",id:"ai-cham-soc-khach-hang",vi:"AI trong chăm sóc khách hàng",en:"AI in customer care",
     dvi:"Voicebot, agent assist, chấm điểm cuộc gọi và tự động hóa quy trình.",den:"Voicebots, agent assist, AI call scoring and process automation."},
    {k:"D",id:"wfm-qm",vi:"WFM & QM",en:"WFM & QM",
     dvi:"Dự báo, xếp lịch, chỉ số vận hành và đánh giá chất lượng cuộc gọi.",den:"Forecasting, scheduling, operational metrics and call quality evaluation."},
    {k:"E",id:"campaign-autodialer",vi:"Campaign & Autodialer",en:"Campaign & Autodialer",
     dvi:"Chiến dịch gọi ra, chế độ quay số, dữ liệu đầu vào và kết nối CRM.",den:"Outbound campaigns, dialing modes, input data and CRM connection."},
    {k:"F",id:"tich-hop-lua-chon-giai-phap",vi:"Tích hợp & lựa chọn giải pháp",en:"Integration & solution selection",
     dvi:"RFP, TCO, nghiệm thu, kiểm thử tích hợp và chuyển đổi số CSKH trong BFSI.",den:"RFP, TCO, acceptance, integration testing and CX transformation in BFSI."}
  ];

  var posts=null;
  function byTopic(k){
    return posts.filter(function(p){return p.topic===k;}).sort(function(a,b){return (a.n||0)-(b.n||0);});
  }
  function link(p,l){
    return '<a href="/blog/'+encodeURIComponent(p.slug)+'/">'+esc(pick(p.title,l))+'</a>';
  }
  /* Trang chủ: lưới 6 chủ đề, mỗi thẻ có vài bài đầu và link sang /blog/#chủ-đề */
  function topicCard(t,l,items){
    var n=items.length, name=l==="en"?t.en:t.vi, desc=l==="en"?t.den:t.dvi;
    var lis=items.slice(0,3).map(function(p){return '<li>'+link(p,l)+'</li>';}).join("");
    return '<li class="topic-card"><h3>'+esc(name)+'</h3>'+
      '<p class="topic-desc">'+esc(desc)+'</p>'+
      '<ul class="topic-links">'+lis+'</ul>'+
      '<a class="more" href="/blog/#'+t.id+'">'+(l==="en"?"See all "+n+" posts →":"Xem cả "+n+" bài →")+'</a></li>';
  }
  /* Trang /blog/: thanh chủ đề + danh sách bài theo từng chủ đề */
  function topicSection(t,l,items){
    var name=l==="en"?t.en:t.vi, desc=l==="en"?t.den:t.dvi;
    var rows=items.map(function(p){
      var sum=pick(p.summary,l), onlyVi=(l==="en" && !(p.title&&p.title.en));
      return '<li><a class="post-card" href="/blog/'+encodeURIComponent(p.slug)+'/">'+
        '<span class="meta">'+(p.minutes?'<span>'+esc(p.minutes)+(l==="en"?" min read":" phút đọc")+'</span>':"")+(onlyVi?'<span>Vietnamese only</span>':"")+'</span>'+
        '<h3>'+esc(pick(p.title,l))+'</h3>'+(sum?'<p>'+esc(sum)+'</p>':"")+
        '<span class="more">'+(l==="en"?"Read more →":"Đọc tiếp →")+'</span></a></li>';
    }).join("");
    return '<section class="topic-block" id="'+t.id+'"><div class="topic-head"><h2>'+esc(name)+' <span class="count">'+items.length+'</span></h2><p>'+esc(desc)+'</p></div>'+
      '<ul class="post-list">'+rows+'</ul></section>';
  }
  function render(){
    if(!posts) return;
    var l=root.getAttribute("data-lang")||"vi";
    document.querySelectorAll("[data-topic-grid]").forEach(function(el){
      el.innerHTML=TOPICS.map(function(t){var it=byTopic(t.k);return it.length?topicCard(t,l,it):"";}).join("");
    });
    document.querySelectorAll("[data-topic-list]").forEach(function(el){
      var nav='<nav class="topic-nav" aria-label="'+(l==="en"?"Topics":"Chủ đề")+'">'+TOPICS.map(function(t){
        var n=byTopic(t.k).length; return n?'<a href="#'+t.id+'">'+esc(l==="en"?t.en:t.vi)+' <span class="count">'+n+'</span></a>':"";
      }).join("")+'</nav>';
      el.innerHTML=nav+TOPICS.map(function(t){var it=byTopic(t.k);return it.length?topicSection(t,l,it):"";}).join("");
      if(location.hash&&!el.hasAttribute("data-scrolled")){
        el.setAttribute("data-scrolled","");
        var h=document.getElementById(decodeURIComponent(location.hash.slice(1))); if(h) h.scrollIntoView();
      }
    });
    var has=posts.length>0;
    document.querySelectorAll("[data-if-posts]").forEach(function(el){el.hidden=!has;});
    document.querySelectorAll("[data-if-no-posts]").forEach(function(el){el.hidden=has;});
  }
  if(document.querySelector("[data-topic-grid],[data-topic-list],[data-if-posts],[data-if-no-posts]")){
    fetch("/blog/posts.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(d){
      posts=(Array.isArray(d)?d:[]).filter(function(p){return p&&p.slug&&!p.draft;}); 
      render();
    }).catch(function(){ posts=[]; render(); });
  }
})();
