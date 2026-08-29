document.addEventListener('DOMContentLoaded', function(){
  var wrap = document.querySelector('.qm-wrap');
  if(!wrap) return;

  // smooth scroll top button already uses inline handler; add keyboard accessibility
  var topBtn = wrap.querySelector('.qm-top-btn');
  if(topBtn){
    topBtn.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') { window.scrollTo({top:0,behavior:'smooth'}); }
    });
  }
});
