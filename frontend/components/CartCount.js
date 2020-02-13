import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.4s;
    backface-visibility: hidden;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn) skew(-5deg) rotate(-1deg);
  }
  .count-enter-active {
    transform: rotateX(0) skew(-5deg) rotate(-1deg);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: scale(4) rotateX(0) skew(-5deg) rotate(-1deg);
  }
  .count-exit {
    transform: rotateX(0.5turn) skew(-5deg) rotate(-1deg);
  }

`;

const Dot = styled.div`
  background: ${props => props.theme.red};
  color: white;
  transform: skew(-5deg) rotate(-1deg);
  padding: 0.5rem;
  linheight: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-varient-numeric: tabular-nums;
`;

const CartCount = ({ count }) =>  (
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}>
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>

);

export default CartCount;
