<template>
    <transition name="modal-fade">
      <div class="modal-backdrop" v-if="show" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-icon" :class="iconType">
                <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 class="modal-title">{{ title }}</h3>
              <button class="modal-close" @click="closeModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
              <button class="modal-button" :class="buttonType" @click="closeModal">{{ buttonText }}</button>
            </div>
          </div>
          <!-- 배경 장식 요소 -->
          <div class="modal-decoration left"></div>
          <div class="modal-decoration right"></div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'AlertModal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: '알림'
      },
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'info',
        validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
      },
      buttonText: {
        type: String,
        default: '확인'
      }
    },
    computed: {
      iconType() {
        return `icon-${this.type}`;
      },
      buttonType() {
        return `button-${this.type}`;
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
  }
  
  .modal-container {
    position: relative;
    width: 90%;
    max-width: 400px;
    overflow: hidden;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 1;
    position: relative;
  }
  
  .modal-header {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .modal-title {
    margin-top: 15px;
    font-size: 22px;
    font-weight: 700;
    color: #333;
    text-align: center;
  }
  
  .modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    cursor: pointer;
    width: 24px;
    height: 24px;
    padding: 0;
    color: #888;
    transition: color 0.2s;
  }
  
  .modal-close:hover {
    color: #333;
  }
  
  .modal-body {
    padding: 0 25px 20px;
    text-align: center;
  }
  
  .modal-body p {
    font-size: 16px;
    line-height: 1.5;
    color: #555;
    margin: 0;
  }
  
  .modal-footer {
    padding: 0 25px 25px;
    display: flex;
    justify-content: center;
  }
  
  .modal-button {
    min-width: 120px;
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
  }
  
  .modal-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  
  .icon-success {
    background: linear-gradient(135deg, #75cc55, #00d3a9);
    box-shadow: 0 6px 15px rgba(117, 204, 85, 0.3);
  }
  
  .icon-error {
    background: linear-gradient(135deg, #ff6b6b, #ff4081);
    box-shadow: 0 6px 15px rgba(255, 107, 107, 0.3);
  }
  
  .icon-warning {
    background: linear-gradient(135deg, #ffb74d, #ff9800);
    box-shadow: 0 6px 15px rgba(255, 183, 77, 0.3);
  }
  
  .icon-info {
    background: linear-gradient(135deg, #64b5f6, #2196f3);
    box-shadow: 0 6px 15px rgba(100, 181, 246, 0.3);
  }
  
  .modal-icon svg {
    width: 28px;
    height: 28px;
    stroke-width: 3;
  }
  
  .button-success {
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    box-shadow: 0 4px 10px rgba(117, 204, 85, 0.2);
  }
  
  .button-error {
    background: linear-gradient(90deg, #ff6b6b, #ff4081);
    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.2);
  }
  
  .button-warning {
    background: linear-gradient(90deg, #ffb74d, #ff9800);
    box-shadow: 0 4px 10px rgba(255, 183, 77, 0.2);
  }
  
  .button-info {
    background: linear-gradient(90deg, #64b5f6, #2196f3);
    box-shadow: 0 4px 10px rgba(100, 181, 246, 0.2);
  }
  
  .modal-decoration {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    z-index: -1;
    opacity: 0.15;
  }
  
  .modal-decoration.left {
    top: -60px;
    left: -60px;
    background: linear-gradient(135deg, #9be15d, #00e3ae);
  }
  
  .modal-decoration.right {
    bottom: -60px;
    right: -60px;
    background: linear-gradient(135deg, #c6f264, #8de557);
  }
  
  /* 트랜지션 애니메이션 */
  .modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  </style>