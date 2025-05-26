// geolocationMock.js
// Geolocation API를 시뮬레이션하는 모듈 (수정된 버전)

import pedestrianSimulationData from './pedestrianSimulationData.js';

/**
 * Geolocation API 시뮬레이션 클래스
 * 실제 위치 추적 대신 미리 정의된 시뮬레이션 데이터를 사용하여
 * 보행자 이동을 시뮬레이션합니다.
 */
class GeolocationMock {
  constructor() {
    this.positionData = pedestrianSimulationData.positionData;
    this.startTime = Date.now();
    this.speedMultiplier = 1.0;
    this.isPaused = false;
    this.watchCallbacks = new Map();
    this.nextWatchId = 1;
    this.currentPositionIndex = 0;
    
    // 시뮬레이션 초기 시간 조정 (0초부터 시작하도록)
    this.timeOffset = 0; // 초기 시간 오프셋 추가
  }

  /**
   * 현재 시뮬레이션 시간 (초) 계산
   */
  getCurrentSimulationTime() {
    if (this.isPaused) {
        return this.pausedTime;
    }
    
    const elapsedRealTime = (Date.now() - this.startTime) / 1000;
    return this.timeOffset + (elapsedRealTime * this.speedMultiplier);
  }

  /**
   * 시뮬레이션 시간에 맞는 위치 데이터 가져오기
   */
  getPositionByTime(simulationTime) {
    // 시뮬레이션 시간보다 타임스탬프가 작거나 같은 마지막 위치 찾기
    let lastPosition = this.positionData[0];
    let nextPosition = null;
    
    for (let i = 0; i < this.positionData.length; i++) {
      const position = this.positionData[i];
      if (position.timestamp <= simulationTime) {
        lastPosition = position;
        nextPosition = this.positionData[i + 1] || null;
      } else {
        nextPosition = position;
        break;
      }
    }
    
    // 마지막 위치만 있으면 그것을 반환
    if (!nextPosition) {
      return this._createPositionObject(lastPosition);
    }
    
    // 두 위치 사이 보간
    const ratio = (simulationTime - lastPosition.timestamp) / 
                  (nextPosition.timestamp - lastPosition.timestamp);
                  
    const interpolatedPosition = {
      lat: lastPosition.lat + (nextPosition.lat - lastPosition.lat) * ratio,
      lng: lastPosition.lng + (nextPosition.lng - lastPosition.lng) * ratio,
      timestamp: simulationTime
    };
    
    return this._createPositionObject(interpolatedPosition);
  }

  /**
   * 위치 객체를 Geolocation API와 유사한 형식으로 변환
   */
  _createPositionObject(position) {
    return {
      coords: {
        latitude: position.lat,
        longitude: position.lng,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };
  }

  /**
   * Geolocation API의 getCurrentPosition 메서드 시뮬레이션
   */
  getCurrentPosition(successCallback, errorCallback, options) {
    try {
      const simulationTime = this.getCurrentSimulationTime();
      const position = this.getPositionByTime(simulationTime);
      
      // 비동기 호출 시뮬레이션
      setTimeout(() => {
        successCallback(position);
      }, 100);
    } catch (error) {
      if (errorCallback) {
        setTimeout(() => {
          errorCallback({
            code: 1,
            message: "시뮬레이션 오류: " + error.message
          });
        }, 100);
      }
    }
  }

  /**
   * Geolocation API의 watchPosition 메서드 시뮬레이션
   */
  watchPosition(successCallback, errorCallback, options) {
    const watchId = this.nextWatchId++;
    
    this.watchCallbacks.set(watchId, {
      successCallback,
      errorCallback,
      interval: null,
      lastUpdate: 0
    });
    
    // 위치 업데이트 시작
    this._startPositionUpdates(watchId);
    
    return watchId;
  }

  /**
   * Geolocation API의 clearWatch 메서드 시뮬레이션
   */
  clearWatch(watchId) {
    const watchInfo = this.watchCallbacks.get(watchId);
    if (watchInfo) {
      if (watchInfo.interval) {
        clearInterval(watchInfo.interval);
      }
      this.watchCallbacks.delete(watchId);
    }
  }

  /**
   * 위치 업데이트 시작
   */
  _startPositionUpdates(watchId) {
    const watchInfo = this.watchCallbacks.get(watchId);
    if (!watchInfo) return;
    
    // 업데이트 간격 (밀리초)
    const updateInterval = 1000;
    
    watchInfo.interval = setInterval(() => {
      try {
        const simulationTime = this.getCurrentSimulationTime();
        const position = this.getPositionByTime(simulationTime);
        
        watchInfo.successCallback(position);
        watchInfo.lastUpdate = Date.now();
      } catch (error) {
        if (watchInfo.errorCallback) {
          watchInfo.errorCallback({
            code: 1,
            message: "시뮬레이션 오류: " + error.message
          });
        }
      }
    }, updateInterval);
  }

  /**
   * 시뮬레이션 속도 설정
   */
  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
  }

  /**
   * 시뮬레이션 일시 정지
   */
  pause() {
    if (!this.isPaused) {
      this.isPaused = true;
      this.pausedTime = this.getCurrentSimulationTime();
    }
  }

  /**
   * 시뮬레이션 재개
   */
  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.startTime = Date.now() - (this.pausedTime / this.speedMultiplier) * 1000;
    }
  }

  /**
   * 시뮬레이션 재시작
   */
  restart() {
    this.startTime = Date.now();
    this.isPaused = false;
  }
  
  /**
   * 원본 geolocation 복원
   */
  restore() {
    // 원래 상태로 복원이 필요한 경우를 위한 메서드
    // 이 예제에서는 사용하지 않음
  }
}

// Geolocation Mock 인스턴스 생성
const mockGeolocation = new GeolocationMock();

/**
 * Mock 메서드를 직접 사용하도록 제공하는 객체 (navigator.geolocation 대체 불가)
 */
export const geolocationMock = {
  getCurrentPosition: mockGeolocation.getCurrentPosition.bind(mockGeolocation),
  watchPosition: mockGeolocation.watchPosition.bind(mockGeolocation),
  clearWatch: mockGeolocation.clearWatch.bind(mockGeolocation),
  
  // 추가 제어 메서드
  setSpeedMultiplier: mockGeolocation.setSpeedMultiplier.bind(mockGeolocation),
  pause: mockGeolocation.pause.bind(mockGeolocation),
  resume: mockGeolocation.resume.bind(mockGeolocation),
  restart: mockGeolocation.restart.bind(mockGeolocation)
};

/**
 * Geolocation 모의 객체 설치 - navigator.geolocation을 대체하지 않음
 * 대신 직접 사용할 수 있는 메서드들을 제공
 */
export function installGeolocationMock() {
  console.log('Geolocation Mock 설치됨');
  return geolocationMock;
}

export default GeolocationMock;