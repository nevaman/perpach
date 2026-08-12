/* Mobile menu */
const button=document.querySelector('.menu');
const nav=document.querySelector('#nav');
button?.addEventListener('click',()=>{
  const open=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!open));
  nav.classList.toggle('open',!open);
});
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!nav.contains(e.target)&&e.target!==button){button.setAttribute('aria-expanded','false');nav.classList.remove('open')}});

/* Header scroll shadow */
const header=document.querySelector('header');
let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{header?.classList.toggle('scrolled',window.scrollY>20);ticking=false});ticking=true}});

/* Scroll-reveal animations */
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.anim-up').forEach(el=>obs.observe(el));

/* Smooth anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);const el=document.getElementById(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}})});

/* Contact / inquiry form handling */
document.querySelectorAll('form').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(form);
    let valid=true;
    form.querySelectorAll('[required]').forEach(f=>{
      if(!f.value.trim()){f.style.borderColor='#c44';valid=false}
      else f.style.borderColor=''
    });
    const emailField=form.querySelector('[type="email"]');
    if(emailField&&emailField.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)){emailField.style.borderColor='#c44';valid=false}
    if(!valid)return;
    const btn=form.querySelector('button[type="submit"]');
    btn.textContent='Sending...';btn.disabled=true;
    setTimeout(()=>{
      form.innerHTML='<div class="form-success"><h3>Inquiry received</h3><p>Thank you. Your message has been submitted and will be reviewed by the appropriate team. Normal response target: five business days.</p></div>';
    },1200);
  });
});
