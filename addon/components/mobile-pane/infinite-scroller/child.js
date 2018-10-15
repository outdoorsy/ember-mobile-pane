import { htmlSafe } from '@ember/string';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { getOwner } from '@ember/application';
import layout from '../../../templates/components/mobile-pane/infinite-scroller/child';

export default Component.extend({
  layout,

  classNames: ['mobile-pane__child'],
  attributeBindings: ['style'],

  // protected
  setAsDocumentScroll: false,
  scroll: 0,
  offsetTop: 0,

  didRender(){
    this._super(...arguments);

    if(get(this, 'setAsDocumentScroll')){
      const current     = document.scrollingElement || document.documentElement;
      current.scrollTop = get(this, 'scroll');
    } else {
      this.element.querySelector('.mobile-pane__child-transformable').style.transform = `translateY(-${get(this, 'scroll')}px)`;
    }
  },

  style: computed('offsetTop', function(){
    return get(this, 'offsetTop') ? htmlSafe(`transform: translateY(${get(this, 'offsetTop')}px);`) : null;
  })
});
