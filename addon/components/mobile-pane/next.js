import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from '../../templates/components/mobile-pane/next';

export default Component.extend({
  layout,

  tagName: '',

  // public

  // protected
  paneCount: 0,
  activeIndex: 0,

  onClick(){},

  isDisabled: computed('activeIndex', 'paneCount', function() {
    return get(this, 'activeIndex') >= Math.floor(get(this, 'paneCount') - 1);
  }),

  actions: {
    onClick(activeIndex, evt){
      evt.stopPropagation();
      if (get(this, 'isDisabled')) { return; }

      get(this, 'onClick')(activeIndex);
      return false;
    }
  }
});
