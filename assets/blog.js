/* Blog — dùng chung cho /blog, mọi bài viết và mục "Bài viết mới" trên trang chủ.
   Danh sách bài lấy từ /blog/posts.json (nguồn duy nhất). */
(function(){
  var root=document.documentElement;

  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function pick(o,l){ if(!o) return ""; if(typeof o==="string") return o; return o[l]||o.vi||o.en||""; }
  var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function fmtDate(iso,l){
    var p=String(iso||"").split("-"); if(p.length<3) return esc(iso);
    return l==="en" ? (+p[2])+" "+MON[+p[1]-1]+" "+p[0] : p[2]+"/"+p[1]+"/"+p[0];
  }

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

  /* Danh sách bài */
  var posts=null;
  function card(p,heading){
    var both=["vi","en"].map(function(l){
      var title=pick(p.title,l), sum=pick(p.summary,l), tags=(p.tags||[]).map(function(t){return '<span class="tag">'+esc(pick(t,l))+'</span>';}).join("");
      var onlyVi=(l==="en" && !(p.title&&p.title.en));
      return '<span data-l="'+l+'">'+
        '<span class="meta"><time datetime="'+esc(p.date)+'">'+fmtDate(p.date,l)+'</time>'+(p.minutes?'<span>· '+esc(p.minutes)+(l==="en"?" min read":" phút đọc")+'</span>':"")+tags+(onlyVi?'<span>· Vietnamese only</span>':"")+'</span>'+
        '<'+heading+'>'+esc(title)+'</'+heading+'>'+
        (sum?'<p>'+esc(sum)+'</p>':"")+
        '<span class="more">'+(l==="en"?"Read more →":"Đọc tiếp →")+'</span>'+
      '</span>';
    }).join("");
    return '<li><a class="post-card" href="/blog/'+encodeURIComponent(p.slug)+'/">'+both+'</a></li>';
  }
  function render(){
    if(!posts) return;
    document.querySelectorAll("[data-post-list]").forEach(function(el){
      var max=+el.getAttribute("data-max")||0, list=max?posts.slice(0,max):posts, h=el.getAttribute("data-heading")||"h2";
      el.innerHTML=list.map(function(p){return card(p,h);}).join("");
    });
    /* Hiện các khối chỉ dùng khi đã có bài (menu, mục trang chủ); ẩn khối "chưa có bài" */
    var has=posts.length>0;
    document.querySelectorAll("[data-if-posts]").forEach(function(el){el.hidden=!has;});
    document.querySelectorAll("[data-if-no-posts]").forEach(function(el){el.hidden=has;});
  }
  if(document.querySelector("[data-post-list],[data-if-posts],[data-if-no-posts]")){
    fetch("/blog/posts.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(d){
      posts=(Array.isArray(d)?d:[]).filter(function(p){return p&&p.slug&&!p.draft;})
        .sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
      render();
    }).catch(function(){ posts=[]; render(); });
  }
})();
