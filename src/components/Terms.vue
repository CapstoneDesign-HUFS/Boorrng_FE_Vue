<template>
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <h1>
            <span class="title-text">
              <span class="title-line">이용약관 및</span>
              <span class="title-line">개인정보처리방침</span>
            </span>
          </h1>
        
          <h2>개인정보 처리방침</h2>
          <div class="terms-box">
            <p>본 서비스는 개인정보 보호법에 따라 이용자의 개인정보를 안전하게 보호하며, 다음과 같은 목적으로 개인정보를 수집 및 이용합니다.</p>
            <ul>
              <li>수집 항목: 이름, 아이디, 비밀번호, 출생년도, 성별</li>
              <li>수집 목적: 서비스 제공, 사용자 맞춤 추천, 통계 분석</li>
              <li>보유 기간: 회원 탈퇴 시까지 또는 법령에 따른 보관 기간</li>
              <li>수집 방법: 회원가입 양식 및 서비스 이용 중 자동 수집</li>
            </ul>
            <p>개인정보는 제3자에게 제공되지 않으며, 외부 위탁도 하지 않습니다. 사용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.</p>
          </div>
        
          <h2>이용약관</h2>
          <div class="terms-box">
            <p>본 약관은 서비스 이용 조건과 절차, 이용자와 서비스 제공자의 권리, 의무 및 책임사항을 규정합니다.</p>
            <ul>
              <li>회원은 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.</li>
              <li>이용자는 타인의 정보를 도용하거나 부정 이용해서는 안 됩니다.</li>
              <li>서비스 제공자는 안정적인 서비스 운영을 위해 최선을 다합니다.</li>
              <li>서비스는 사전 고지 없이 내용이 변경되거나 종료될 수 있습니다.</li>
              <li>추천 경로 및 보행속도 정보는 참고용이며, 정확성에 대한 법적 책임은 지지 않습니다.</li>
            </ul>
            <p>본 약관은 대한민국 법령에 따라 해석되며, 분쟁 시 관할 법원은 서울중앙지방법원으로 합니다.</p>
          </div>
  
          <div class="close-button-container">
            <button class="close-btn" @click="closeModal" aria-label="닫기">
              <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Terms",
    methods: {
      closeModal() {
        this.$emit('close', false);
      }
    }
  }
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* 모달 오버레이 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* 모달 컨테이너 */
  .modal-container {
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: modalFadeIn 0.3s ease-out;
  }
  
  /* 모달 내용 */
  .modal-content {
    width: 100%;
    padding: 30px 20px;
    overflow-y: auto;
    max-height: 90vh;
  }
  
  /* 제목 스타일 */
  h1 {
    font-size: 1.8rem;
    font-weight: 900;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: #333;
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 1px rgba(0,0,0,0.1);
  }
  
  .title-text {
    text-align: center;
    overflow: hidden;
    font-weight: 900;
  }
  
  .title-line {
    display: block;
    line-height: 1.3;
    white-space: nowrap;
    letter-spacing: -0.5px;
  }
  
  h2 {
    font-size: 18px;
    margin-top: 2rem;
    margin-bottom: 12px;
    font-weight: 700;
    color: #666;
  }
  
  /* 약관 내용 박스 */
  .terms-box {
    padding: 1.5rem;
    background-color: #f8f9fa;
    border: 2px solid #b2eab3;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    font-size: 15px;
    line-height: 1.7;
    color: #343a40;
  }
  
  .terms-box p {
    margin-bottom: 1rem;
  }
  
  .terms-box ul {
    padding-left: 1.2rem;
    color: #212529;
  }
  
  .terms-box li {
    line-height: 1.7;
    margin-bottom: 0.5rem;
  }
  
  /* 닫기 버튼 컨테이너 */
  .close-button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  /* 닫기 버튼 */
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background-color: #f1f1f1;
    color: #666;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .close-btn:hover {
    background-color: #e0e0e0;
    color: #333;
  }
  
  .close-icon {
    width: 20px;
    height: 20px;
  }
  
  /* 애니메이션 */
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  </style>