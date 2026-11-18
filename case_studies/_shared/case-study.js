(function () {
  var SCALE = 2.5;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  Array.prototype.forEach.call(document.querySelectorAll('.cs-zoom'), function (btn) {
    var full = btn.querySelector('.cs-zoom-full');
    if (!full) return;
    var zoomed = false;
    var dragged = false;
    var downX = 0;
    var downY = 0;

    function preload() {
      if (typeof full.decode === 'function' && !full.complete) {
        full.decode().catch(function () {});
      }
    }

    function applyPan(clientX, clientY) {
      var rect = btn.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = clamp(clientX - rect.left, 0, rect.width);
      var y = clamp(clientY - rect.top, 0, rect.height);
      var tx = clamp(-x * (SCALE - 1), -rect.width * (SCALE - 1), 0);
      var ty = clamp(-y * (SCALE - 1), -rect.height * (SCALE - 1), 0);
      full.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + SCALE + ')';
    }

    function centerPan() {
      var rect = btn.getBoundingClientRect();
      applyPan(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    function setZoom(on, event) {
      zoomed = on;
      btn.classList.toggle('is-zoomed', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) {
        preload();
        var point = event && event.detail !== 0 && (event.clientX || event.clientY);
        if (point) applyPan(event.clientX, event.clientY);
        else centerPan();
      } else {
        full.style.transform = '';
      }
    }

    btn.addEventListener('pointerenter', preload, { once: true });
    btn.addEventListener('focus', preload, { once: true });
    btn.addEventListener('pointerdown', function (event) {
      downX = event.clientX;
      downY = event.clientY;
      dragged = false;
    });
    btn.addEventListener('pointermove', function (event) {
      if (!zoomed) return;
      if (event.buttons > 0 && Math.abs(event.clientX - downX) + Math.abs(event.clientY - downY) > 8) {
        dragged = true;
      }
      applyPan(event.clientX, event.clientY);
    });
    btn.addEventListener('click', function (event) {
      if (dragged) {
        dragged = false;
        return;
      }
      setZoom(!zoomed, event);
    });
  });
})();

(function () {
  var modal = document.getElementById('cs-modal');
  if (!modal) return;
  var panel = modal.querySelector('.cs-modal-panel');
  var img = modal.querySelector('.cs-modal-img');
  var video = modal.querySelector('.cs-modal-video');
  var cap = modal.querySelector('.cs-modal-cap');
  var closeBtn = modal.querySelector('.cs-modal-close');
  var lastFocus = null;

  function openModal(trigger) {
    var kind = trigger.getAttribute('data-modal');
    var src = trigger.getAttribute('data-src');
    var label = trigger.getAttribute('data-label') || '';
    var playVideo = false;
    lastFocus = document.activeElement;
    img.hidden = kind !== 'image';
    video.hidden = kind !== 'video';
    cap.textContent = label;
    cap.hidden = !label;
    if (kind === 'image') {
      video.pause();
      video.removeAttribute('src');
      video.load();
      img.src = src;
      img.alt = label;
    } else {
      var poster = trigger.getAttribute('data-poster');
      img.removeAttribute('src');
      if (poster) video.poster = poster;
      else video.removeAttribute('poster');
      video.src = src;
      video.load();
      playVideo = true;
    }
    panel.setAttribute('aria-label', label || 'Media preview');
    modal.hidden = false;
    document.body.classList.add('cs-modal-open');
    closeBtn.focus();
    if (playVideo) {
      var playback = video.play();
      if (playback && playback.catch) playback.catch(function () {});
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('cs-modal-open');
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
    img.removeAttribute('src');
    img.hidden = true;
    video.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-modal]'), function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(trigger);
    });
  });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (event) {
    if (!modal.hidden && event.key === 'Escape') closeModal();
  });
})();


(function(){
  var modal=document.getElementById('cs-dl-modal');
  if(!modal)return;
  modal.hidden=true;
  function open(){modal.hidden=false;modal.style.display='flex';document.body.classList.add('cs-modal-open');}
  function close(){modal.hidden=true;modal.style.display='none';document.body.classList.remove('cs-modal-open');}
  var btns=document.querySelectorAll('[data-cs-dl-placeholder]');
  for(var i=0;i<btns.length;i++){btns[i].addEventListener('click',open);}
  var cbtns=document.querySelectorAll('[data-cs-dl-close]');
  for(var i=0;i<cbtns.length;i++){cbtns[i].addEventListener('click',close);}
  modal.addEventListener('click',function(e){if(e.target===modal)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape' && !modal.hidden)close();});
  window.csDlOpen=open;window.csDlClose=close;
})();
