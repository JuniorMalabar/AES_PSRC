<template>
  <div class="wrapper">
    <p v-if="message" class="message">
      {{message}}
    </p>
    <div @keyup.enter="toTop()" class="edit-wrapper">
      <input v-model="inputByte" type="text">
      <Button
        :disabled="error"
        :textOnButton="'Ввод'"
        @select-element="toTop()"
      />
    </div> 
    <div v-if="error" class="error">
      Ошибка ввода!
    </div>  
  </div>
</template>

<script>
  import Validate from '../../helpers/validate';
  import Button from '../Button/Button.vue';

  export default {
    components: { Button },
    props: {
      message: {
        type: String,
        default: null
      },
      errorOnTop: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        inputByte: "",
        error: false
      }
    },
    methods: {
      toTop() {
        this.$emit("select-element", this.inputByte)
      }
    },
    watch: {
      inputByte(val) {
        this.error = Validate.allowedLen(val)
      },
      error(val) {
        this.$emit("input-error", val)
      },
      errorOnTop(val) {
        this.error = val
      }
    }
}
</script>

<style lang="scss" scoped>
  .edit-wrapper {
    display: flex;
    margin-bottom: 10px;
  }
  .message {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    color: red;
    background: rgba(255, 0, 0, 0.123);
    padding: 10px;
  }
  .wrapper {
    width: max-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
</style>