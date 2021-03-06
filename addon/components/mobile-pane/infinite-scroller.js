import Component from '@ember/component';
import layout from '../../templates/components/mobile-pane/infinite-scroller';

import { inject as service } from '@ember/service';
import { get, set, computed, observer } from '@ember/object';
import { once } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { A } from '@ember/array';

export default Component.extend({
  layout,

  classNames: ['mobile-pane__infinite-scroller'],

  router: service(),
  memory: service('memory-scroll'),

  //public
  previousModel: null,
  currentModel: null,
  nextModel: null,

  //private
  prevChildScroll: 0,
  currentChildScroll: 0,
  nextChildScroll: 0,
  childOffsetTop: 0,

  onDragStart(){},
  onDragMove(dx){},
  onDragEnd(activeIndex){},

  didInsertElement(){
    this._super(...arguments);

    //TODO: purge scroll states if we came from a higher level route
    this._setupScroller();
  },

  updateActiveIndex: observer('models.@each.id', function(){
    once(() => {
      // we received new models, update activeIndex to the currentModel index
      this._setupScroller();
    });
  }),

  _setupScroller(){
    this.restoreScroll();

    const activeIndex = get(this, 'previousModel') ? 1 : 0;
    get(this, 'onDragEnd')(activeIndex);
  },

  models: computed('previousModel', 'currentModel', 'nextModel', function(){
    return A([get(this, 'previousModel'), get(this, 'currentModel'), get(this, 'nextModel')].filter(Boolean));
  }),

  actions: {
    onDragStart(){
      // write scroll offset for prev/next children
      set(this, 'childOffsetTop', document.scrollingElement.scrollTop || document.documentElement.scrollTop);

      get(this, 'onDragStart')(...arguments);
    },
    onDragMove(){
      get(this, 'onDragMove')(...arguments);
    },
    onDragEnd(targetIndex){
      // transition to previous or next model
      const targetModel = get(this, 'models').objectAt(targetIndex);
      if(targetModel !== get(this, 'currentModel')){
        // store the scroll position of currentModel
        this.storeScroll();

        // transition to the targetModel on the current route
        get(this, 'router').transitionTo(get(this, 'router.currentRouteName'), targetModel);
      }

      get(this, 'onDragEnd')(...arguments);
    }
  },

  storeScroll(){
    const key = this._buildMemoryKey(this.get('currentModel.id'));
    this.get('memory')[key] = document.scrollingElement.scrollTop || document.documentElement.scrollTop;
  },

  restoreScroll(){
    const prevKey     = this._buildMemoryKey(this.get('previousModel.id'));
    const currentKey  = this._buildMemoryKey(this.get('currentModel.id'));
    const nextKey     = this._buildMemoryKey(this.get('nextModel.id'));

    set(this, 'prevChildScroll', this.get('memory')[prevKey] || 0);
    set(this, 'currentChildScroll', this.get('memory')[currentKey] || 0);
    set(this, 'nextChildScroll', this.get('memory')[nextKey] || 0);
  },

  // utils
  _buildMemoryKey(id){
    return `mobile-pane/${this.get('router.currentRouteName')}.${id}`;
  }
});
