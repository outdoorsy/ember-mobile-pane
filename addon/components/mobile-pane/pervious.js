import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from '../../templates/components/mobile-pane/pervious';

export default Component.extend({
  layout,

  tagName: '',

  // public

  // protected
  paneCount: 0,
  activeIndex: 0,

  onClick(){},

  isDisabled: computed('activeIndex', 'paneCount', function() {
    return get(this, 'activeIndex') <= 0;
  }),

  actions: {
    onClick(activeIndex){
      if (get(this, 'isDisabled')) { return; }

      event.stopPropagation();
      event.preventDefault();

      get(this, 'onClick')(activeIndex);
    }
  }
});
