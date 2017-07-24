'use strict';

var Acquaint = function(name, aquaints) {
  this.name = name;
  this.bufferSpace = 15;
  this.enabled = true;
  this.steps = aquaints;
  this.index = 0;
  this.completeMessage = `That's all for now!`;
  this.elements = [];
  this.getName = function () {
    return this.name;
  };
};

var getWrapper = function() {
  if(!document.getElementById('acquaint')) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = `<div id="acquaint" class="acquaint-card"></div>`;
    return wrapper.childNodes[0];
  }
  else {
    return document.getElementById('acquaint');
  }
};

var getContents = function(steps, index) {
  var stepCount = steps.length;
  var step = steps[index];
  var text = typeof step.message === 'function' ? step.message() : step.message;
  var el = `
      <div class="acquaint-close">✕</div>
      ${step.title ? `<div class="acquaint-header">${index+1}/${stepCount} - ${step.title}</div>` : ''}
      <div class="acquaint-text">${text}</div>
      ${step.button ? `<div class="acquaint-button">${step.button}</div>` : ''}
  `;
  return el;
};

Acquaint.prototype.render = function() {
  var base = this;
  var step = base.steps[base.index];
  var wrapper = getWrapper();
  var template = getContents(base.steps, base.index);
  wrapper.innerHTML = template;

  if(step.advance) {
    var event = step.advance.event;
    var element = typeof step.advance.element === 'object' ? step.advance.element : document.querySelector(step.advance.element);
    var originalCallback = element[event];

    var resolve = function(e){
      if(!step.advance.condition && base.enabled || step.advance.condition(e) && base.enabled) {

        if(step.advance.callback) {
          step.advance.callback();
        }

        element[event] = originalCallback;
        if(originalCallback !== null) {
          element[event](e);
        }
        base.advance();
      }
    };
    originalCallback = element[event];
    element[event] = resolve;
  }
  else {
    wrapper.querySelector('.acquaint-button').addEventListener('click', function() {
      base.advance();
    });
  }
  document.body.appendChild(wrapper);
  base.elements.push(wrapper);
  wrapper.querySelector('.acquaint-close').onclick = function() {
    base.minimize();
  };
  this.position();
};

Acquaint.prototype.advance = function() {
  if(this.index+1 < this.steps.length) {
    this.remove();
    this.index++;
    this.render();
  }
  else {
    this.complete();
  }
};

Acquaint.prototype.position = function() {
  var wrapper = this.elements[this.index];
  var target = this.steps[this.index].target;
  var position = this.steps[this.index].position.split('-');
  var y = position[0];
  var x = position[1];
  var anchor;
  var top;
  var bottom;
  var left;
  var right;

  if(target === window) {
    anchor = {
      top: -window.scrollY,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    top = this.bufferSpace;
    bottom = anchor.height - this.bufferSpace - wrapper.offsetHeight;
    left = this.bufferSpace;
    right = anchor.width - this.bufferSpace - wrapper.offsetWidth;
    wrapper.style.position = 'fixed';
  }
  else {
    anchor = document.querySelector(target).getBoundingClientRect();
    top = (anchor.top + window.scrollY) - anchor.height - wrapper.offsetHeight + this.bufferSpace;
    bottom = (anchor.bottom + window.scrollY) + this.bufferSpace;
    left = anchor.left;
    right = anchor.left + anchor.width - wrapper.offsetWidth;

    if(top <= 0) {
      y = 'bottom';
    }
    if(bottom >= window.innerHeight) {
      y = 'top';
    }
    if(left <= 0) {
      x = 'right';
    }
    if(right >= window.innerWidth) {
      x = 'left';
    }
  }

  switch (y) {
    case 'top':
    top = top;
      break;
    case 'bottom':
      top = bottom;
      break;
  }
  switch (x) {
    case 'left':
      left = left;
      break;
    case 'right':
      left = right;
      break;
  }
  wrapper.style.top = `${top}px`;
  wrapper.style.left = `${left}px`;
};

Acquaint.prototype.minimize = function() {
  var wrapper = document.createElement('div');
  var stepCount = this.steps.length;
  var title = this.steps[this.index].title;
  var minimized = `<div class="aquaint-minimized">${this.index+1}/${stepCount} - ${title}</div>`;
  var name = this.getName();
  var step = this.elements[this.index];
  wrapper.innerHTML = minimized;
  this.enabled = false;
  step.style.display = 'none';
  wrapper.childNodes[0].onclick = function(event) {
    event.target.remove();
    window[name].enabled = true;
    step.style.display = 'flex';
  };
  document.body.appendChild(wrapper.childNodes[0]);
};

Acquaint.prototype.remove = function() {
  this.elements[this.index].remove();
};

Acquaint.prototype.complete = function() {
  var el = this.elements[this.index];
  el.setAttribute('data-complete', this.completeMessage);
  el.classList.add('completed');
  setTimeout(function() {
    el.remove();
  }, 3000);
};

Acquaint.prototype.init = function() {
  this.checkForErrors();
  if(this.enabled) {
    var name = this.getName();
    this.render(this.index);

    window.onresize = function() {
      window[name].position();
    };
  }
};

Acquaint.prototype.checkForErrors = function() {
  for(var i = 0; i < this.steps.length; i++) {
    var step = this.steps[i];
    if(step.button && step.advance) {
      throw new Error('You cannot have both button and advance properties');
    }
  }
};
