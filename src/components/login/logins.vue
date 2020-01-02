<template>
  <div class="loginBg">
    <div class="iconList">
      <img class="img1" src="../../assets/login/icon/light.png" alt="">
      <img class="img2" src="../../assets/login/icon/light.png" alt="">
      <div class="rotate1">
        <img class="img3" src="../../assets/login/icon/light.png" alt="">
      </div>
      <div class="rotate2">
        <img class="img4" src="../../assets/login/icon/light.png" alt="">
      </div>
    </div>
    <img class="edu" src="../../assets/login/icon/edu.png" alt="">
    <img class="energy" src="../../assets/login/icon/energy.png" alt="">
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="lizi"
    >
    </vue-particles>
  </div>
</template>

<script>
    export default {
        name: 'logins'
    }
</script>

<style scoped lang="less">
@keyframes animX {
  0% {
    top: 185px;
  }
  100% {
    top: 865px;
  }
}
@keyframes animY {
  0% {
    left: 505px;
  }
  100% {
    left: 800px;
  }
}
@keyframes animXH {
  0% {
    top: 375px;
  }
  100% {
    top: 675px;
  }
}
@keyframes animYH {
  0% {
    left: 315px;
  }
  100% {
    left: 990px;
  }
}
@keyframes animXLeftH {
  0% {
    top: -16px;
  }
  100% {
    top: 664px;
  }
}
@keyframes animYLeftH {
  0% {
    left: -16px;
  }
  100% {
    left: 284px;
  }
}
@keyframes animXRightH {
  0% {
    top: -16px;
  }
  100% {
    top: 664px;
  }
}
@keyframes animYRightH {
  0% {
    left: -16px;
  }
  100% {
    left: 284px;
  }
}
@keyframes scale {
  0% {
    transform: scale(0.7);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.7);
  }
}
@keyframes scaleIcon {
  0% {
    transform: scale(0.7);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.7);
  }
}
.loginBg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../../assets/login/loginBg.png") no-repeat center center;
  background-size: cover;
  .iconList {
    width: 100%;
    height: 100%;
    .rotate1 {
      position: relative;
      top: 202px;
      left: 518px;
      /*top: 20.5%;*/
      /*left: 27%;*/
      width: 300px;
      height: 680px;
      transform: rotate(45deg);
      & img {
        position: absolute;
      }
      & img.img3 {
        animation: animXRightH 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate, animYRightH 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate, scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
      }
    }
    .rotate2 {
      position: relative;
      top: -478px;
      left: 518px;
      width: 300px;
      height: 680px;
      transform: rotate(135deg);
      & img {
        position: absolute;
      }
      & img.img4 {
        animation: animXLeftH 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate, animYLeftH 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate, scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
      }
    }
    & img {
      position: absolute;
      /*top: 285px;*/
      /*left: 415px;*/
      /*top: 765px;*/
      /*left: 895px;*/

      /*top: 605px;*/
      /*left: 525px;*/

      /*top: 460px;*/
      /*left: 795px;*/
      width: 32px;
      height: 32px;
    }
    & img.img1 {
      animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate, animY 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate, scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    & img.img2 {
      animation: animXH 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate, animYH 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate, scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
    /*& img.img3 {
      animation: animXLeftH 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate, animYLeftH 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate, scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }*/
    & img.img4 {
      animation: animXH 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate, animYH 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate, scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }
  }
  & img.edu {
    width: 121px;
    height: 104px;
    position: absolute;
    top: 26%;
    left: 37%;
    animation: scaleIcon 2s linear 0s infinite alternate;
  }
  & img.energy {
    width: 121px;
    height: 104px;
    position: absolute;
    top: 49%;
    left: 14%;
    animation: scaleIcon 3s linear 0s infinite alternate;
  }
}
</style>
