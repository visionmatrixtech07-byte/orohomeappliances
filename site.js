(function(){
  'use strict';
  var WA='919110657751';
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  function track(n,d){ if(window.oroTrack) window.oroTrack(n,d||{}); }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-track]'); if(!a) return;
    track(a.getAttribute('data-track')==='call'?'oro_call_click':'oro_whatsapp_click',{
      link_text:(a.textContent||'').trim().replace(/\s+/g,' ').slice(0,60),link_url:a.getAttribute('href')});
  });
  var form=document.getElementById('bookingForm');
  if(!form) return;
  var status=form.querySelector('.status');
  function val(n){var f=form.elements.namedItem(n);return f?f.value.trim().replace(/\s+/g,' '):'';}
  function bad(msg,field){status.style.color='#B42318';status.textContent=msg;form.elements.namedItem(field).focus();}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=val('name'),phone=val('phone').replace(/[^\d+]/g,'');
    if(!name) return bad('Enter your name.','name');
    if(phone.replace(/\D/g,'').length<10) return bad('Enter a 10-digit phone number.','phone');
    var msg=['Hello ORO Home Appliances,','','Request: '+val('intent'),'Appliance: '+val('appliance'),
      'Brand: '+(val('brand')||'Not provided'),'Town: '+val('town'),'Details: '+(val('details')||'Not provided'),'',
      'Name: '+name,'Phone: '+phone,'Source: Website form ('+location.pathname+')'].join('\n');
    track('oro_booking_request_submitted',{form_id:form.id,intent:val('intent'),appliance:val('appliance'),brand:val('brand'),town:val('town')});
    track('oro_whatsapp_lead_initiated',{form_id:form.id});
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer');
    status.style.color='';status.textContent='WhatsApp opened. Tap Send there to complete your request.';
    form.reset();
  });
})();
