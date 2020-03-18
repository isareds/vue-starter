<template>
  <transition name="fade">
    <div v-if="visible" class="z-50 fixed inset-0">
      <div
        class="absolute inset-0 opacity-50 bg-gray-500"
        @click="hide()"
      ></div>
      <div
        ref="backdrop"
        @click="handleBackdropClick($event)"
        class="absolute inset-0 flex flex-col items-center justify-center"
      >
        <div >
          <div class="w-128 bg-white shadow-2xl flex flex-col">
            <div class="h-2 bg-red-400"></div>
            <div class="p-4">
              <div class="flex flex-row items-baseline mb-4">
                <i class="fa fa-exclamation-circle tx-danger-400 mr-3 tx-6"></i>
                <div class="flex-cont-col">
                  <h2 class="m-0 mb-3">{{ title }}</h2>
                  <p>{{ text }}</p>
                </div>
              </div>
            </div>
            <div
              class="py-3 px-4 bg-grey-100 b-t-grey-200 b-t-width-1 flex-cont-row v-center"
            >
              <button
                class="tx-grey-700 px-3 py-2 mr-3 ml-auto no-outline"
                @click="confirm(false)"
              >
                {{ cancelText }}
              </button>
              <button
                class="radius-3 bg-danger-200 tx-danger-800 tx-bold px-3 py-2 radius-4 no-outline"
                @click="confirm(true)"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Dialog from '../plugins/dialog';


export default {
  components: {
  },
  data() {
    return {
      // variable that shows/hides modal
      visible: false,
      type: '',
      params: {},
      cancelText: 'Annulla',
      confirmText: 'Conferma',
      onConfirm: {},
    };
  },
  methods: {
    hide() {
      // method for closing modal
      this.visible = false;
    },
    confirm(result) {
      console.log(result);

      this.hide();
      this.onConfirm(result);
    },
    show(params) {
      this.params = params;
      this.type = params.type;
      this.onConfirm = params.onConfirm;

      // making modal visible
      this.visible = true;
    },
    handleBackdropClick(event) {
      if (this.$refs.backdrop == event.target) {
        this.hide();
      }
    },
  },
  beforeMount() {
    console.log('Before mount');
    Dialog.EventBus.$on('show', this.show);
  },
  beforeDestroy() {
    console.log('Before destroy');
    Dialog.EventBus.$off('show', this.show);
  },
};
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  z-index: 1000;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
.modal-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
}
.modal-button {
  flex-grow: 1;
}
</style>
