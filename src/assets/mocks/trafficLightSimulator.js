// trafficLightSimulator.js
// 신호등 상태 시뮬레이션을 위한 모듈

import pedestrianSimulationData from './pedestrianSimulationData';

/**
 * 신호등 시뮬레이터 클래스
 * 경로상의 신호등 상태를 시뮬레이션하고 
 * 시간에 따른 신호등 상태 변화를 제공합니다.
 */
class TrafficLightSimulator {
  constructor() {
    this.trafficLights = pedestrianSimulationData.trafficLightStates;
    this.startTime = Date.now();
    this.speedMultiplier = 1.0;
    this.isPaused = false;
    this.pausedTime = 0;
  }

  /**
   * 현재 시뮬레이션 시간 (초) 계산
   */
  getCurrentSimulationTime() {
    if (this.isPaused) {
      return this.pausedTime;
    }
    
    const elapsedRealTime = (Date.now() - this.startTime) / 1000;
    return elapsedRealTime * this.speedMultiplier;
  }

  /**
   * 특정 시간의 모든 신호등 상태 가져오기
   */
  getAllTrafficLightStates(simulationTime) {
    const states = {};
    
    this.trafficLights.forEach(trafficLight => {
      states[trafficLight.id] = this.getTrafficLightState(trafficLight.id, simulationTime);
    });
    
    return states;
  }

  /**
   * 특정 신호등의 특정 시간 상태 가져오기
   */
  getTrafficLightState(trafficLightId, simulationTime) {
    const trafficLight = this.trafficLights.find(light => light.id === trafficLightId);
    if (!trafficLight) {
      throw new Error(`신호등 ID ${trafficLightId}를 찾을 수 없습니다.`);
    }
    
    // 시간보다 이전이거나 같은 가장 최근 상태 찾기
    let currentState = trafficLight.states[0];
    let nextState = null;
    
    for (let i = 0; i < trafficLight.states.length; i++) {
      const state = trafficLight.states[i];
      if (state.timestamp <= simulationTime) {
        currentState = state;
        nextState = trafficLight.states[i + 1] || null;
      } else {
        nextState = state;
        break;
      }
    }
    
    // 상태 간 전환이 없으면 마지막 상태 사용
    if (!nextState) {
      return this._calculateRemainingTime(currentState, simulationTime);
    }
    
    // 현재 상태 유지 여부 확인
    if (currentState.isRed !== nextState.isRed) {
      // 상태 전환 시점 확인
      if (simulationTime >= nextState.timestamp) {
        // 다음 상태로 전환
        return this._calculateRemainingTime(nextState, simulationTime);
      }
    }
    
    // 현재 상태 유지
    return this._calculateRemainingTime(currentState, simulationTime);
  }

  /**
   * 남은 시간 계산 (사이클 고려)
   */
  _calculateRemainingTime(state, currentTime) {
    const timeSinceStateChange = currentTime - state.timestamp;
    
    // 기본 사이클 시간
    const redDuration = 60;
    const greenDuration = 30;
    const cycleDuration = redDuration + greenDuration;
    
    // 현재 사이클 내 경과 시간
    const cycleElapsedTime = timeSinceStateChange % cycleDuration;
    
    let isRed = state.isRed;
    let remainingTime = 0;
    
    // 초기 상태에서 신호가 바뀌었는지 확인
    if (state.isRed) {
      if (cycleElapsedTime < redDuration) {
        // 여전히 빨간불
        remainingTime = redDuration - cycleElapsedTime;
      } else {
        // 초록불로 변경됨
        isRed = false;
        remainingTime = greenDuration - (cycleElapsedTime - redDuration);
      }
    } else {
      if (cycleElapsedTime < greenDuration) {
        // 여전히 초록불
        remainingTime = greenDuration - cycleElapsedTime;
      } else {
        // 빨간불로 변경됨
        isRed = true;
        remainingTime = redDuration - (cycleElapsedTime - greenDuration);
      }
    }
    
    return {
      id: state.id || "",
      isRed,
      remainingTime: Math.round(remainingTime),
      // 추가 정보
      elapsedTime: Math.round(cycleElapsedTime),
      totalCycleTime: cycleDuration
    };
  }

  /**
   * 시뮬레이션 속도 설정
   */
  setSpeedMultiplier(multiplier) {
    // 현재 시뮬레이션 시간 저장
    const currentSimTime = this.getCurrentSimulationTime();
    
    // 새 배속으로 startTime 재설정
    this.speedMultiplier = multiplier;
    this.startTime = Date.now() - (currentSimTime / this.speedMultiplier) * 1000;
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
   * 다음 신호등까지의 최적 보행 속도 계산
   */
  calculateOptimalSpeed(currentPosition, nextTrafficLight, distanceToTrafficLight) {
    if (!nextTrafficLight) {
      return {
        recommendedSpeed: 1.2, // 기본 보행 속도
        message: "다음 신호등이 없습니다.",
        caseType: "없음"
      };
    }
    
    // 시뮬레이션 시간 기준 신호등 상태 가져오기
    const simulationTime = this.getCurrentSimulationTime();
    const lightState = this.getTrafficLightState(nextTrafficLight.id, simulationTime);
    
    const minSpeed = 0.8; // 최소 보행 속도 (m/s)
    const maxSpeed = 2.0; // 최대 보행 속도 (m/s)
    const normalSpeed = 1.2; // 일반 보행 속도 (m/s)
    
    let recommendedSpeed = normalSpeed;
    let message = "";
    let caseType = "";
    
    if (!lightState.isRed) {
      // 초록불 케이스
      const remainingGreenTime = lightState.remainingTime;
      const minTimeToReach = distanceToTrafficLight / maxSpeed;
      const maxTimeToReach = distanceToTrafficLight / minSpeed;
      
      if (minTimeToReach <= remainingGreenTime) {
        // 케이스 1: 초록불 동안 도달 가능
        caseType = "케이스1";
        if (maxTimeToReach <= remainingGreenTime) {
          recommendedSpeed = minSpeed;
          message = "여유있게 이동하세요. 현재 초록불에 충분히 도착할 수 있습니다.";
        } else {
          const requiredSpeed = distanceToTrafficLight / remainingGreenTime;
          recommendedSpeed = Math.min(Math.max(requiredSpeed, minSpeed), maxSpeed);
          message = `${recommendedSpeed.toFixed(1)}m/s 속도로 이동하면 현재 초록불에 도착할 수 있습니다.`;
        }
      } else {
        // 케이스 2: 초록불 동안 도달 불가능
        caseType = "케이스2";
        const nextGreenStart = 60 + remainingGreenTime; // 다음 초록불까지의 시간
        const optimalSpeed = distanceToTrafficLight / nextGreenStart;
        
        if (optimalSpeed <= maxSpeed && optimalSpeed >= minSpeed) {
          recommendedSpeed = optimalSpeed;
          message = `${recommendedSpeed.toFixed(1)}m/s 속도로 이동하면 다음 초록불 시작에 도착할 수 있습니다.`;
        } else if (optimalSpeed < minSpeed) {
          recommendedSpeed = minSpeed;
          message = "천천히 이동하세요. 다음 초록불에 맞춰 도착할 수 있습니다.";
        } else {
          recommendedSpeed = maxSpeed;
          message = "빠르게 이동하더라도 다음 초록불까지 대기 시간이 발생합니다.";
        }
      }
    } else {
      // 빨간불 케이스
      const remainingRedTime = lightState.remainingTime;
      const minTimeToReach = distanceToTrafficLight / maxSpeed;
      
      if (minTimeToReach >= remainingRedTime) {
        // 케이스 3: 빨간불 종료 후 도착 가능
        caseType = "케이스3";
        const optimalTime = remainingRedTime + 2; // 2초 여유
        const optimalSpeed = distanceToTrafficLight / optimalTime;
        
        if (optimalSpeed <= maxSpeed && optimalSpeed >= minSpeed) {
          recommendedSpeed = optimalSpeed;
          message = `${recommendedSpeed.toFixed(1)}m/s 속도로 이동하면 신호가 바뀐 직후 도착할 수 있습니다.`;
        } else if (optimalSpeed < minSpeed) {
          recommendedSpeed = minSpeed;
          message = "천천히 이동하세요. 신호가 바뀐 후 도착할 수 있습니다.";
        } else {
          recommendedSpeed = maxSpeed;
          message = "빠르게 이동하면 신호가 바뀐 직후 도착할 수 있습니다.";
        }
      } else {
        // 케이스 4: 빨간불일 때 도착해서 대기해야 함
        caseType = "케이스4";
        const fastStrategy = {
          speed: maxSpeed,
          arrivalTime: distanceToTrafficLight / maxSpeed,
          waitTime: remainingRedTime - (distanceToTrafficLight / maxSpeed)
        };
        
        const timeToNextGreen = remainingRedTime;
        const slowestPossibleSpeed = distanceToTrafficLight / timeToNextGreen;
        
        let slowStrategy;
        if (slowestPossibleSpeed >= minSpeed) {
          // 천천히 걸으면 대기 시간 최소화 가능
          slowStrategy = {
            speed: slowestPossibleSpeed,
            arrivalTime: timeToNextGreen,
            waitTime: 0
          };
        } else {
          // 가장 느리게 걸어도 대기 필요
          slowStrategy = {
            speed: minSpeed,
            arrivalTime: distanceToTrafficLight / minSpeed,
            waitTime: remainingRedTime - (distanceToTrafficLight / minSpeed)
          };
        }
        
        if (slowStrategy.waitTime <= fastStrategy.waitTime && slowStrategy.speed <= maxSpeed) {
          recommendedSpeed = slowStrategy.speed;
          
          if (slowStrategy.waitTime <= 0) {
            message = "이 속도로 이동하면 신호 대기 없이 지나갈 수 있습니다.";
          } else {
            message = `이 속도로 이동하면 약 ${Math.ceil(slowStrategy.waitTime)}초 대기 후 지나갈 수 있습니다.`;
          }
        } else {
          recommendedSpeed = fastStrategy.speed;
          message = `빠르게 이동하더라도 약 ${Math.ceil(fastStrategy.waitTime)}초 대기가 필요합니다.`;
        }
      }
    }
    
    return {
      recommendedSpeed,
      message,
      caseType,
      // 추가 정보
      trafficLightState: lightState
    };
  }
}

// 단일 인스턴스 생성 및 내보내기
const trafficLightSimulator = new TrafficLightSimulator();
export default trafficLightSimulator;